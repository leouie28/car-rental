import React, { useCallback, useEffect, useState } from 'react'
import Container from '../../../components/Container'
import { useQuery } from '@tanstack/react-query'
import api from '../../../lib/api'
import { GoogleMap, Marker,  useJsApiLoader } from '@react-google-maps/api'
import socket from '../../../socket'

const containerStyle = {
  width: '100%',
  height: '600px',
}

const center = {
  // lat: -3.745,
  // lng: -38.523,
  lat: 12.066962, 
  lng: 124.594170
}

export default function TrackPage() {
  const [list, setList] = useState([])
  const [id, setId] = useState("")
  const [selected, setSelected] = useState(null)
  const [map, setMap] = useState(null)
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA3DcqU3LvRQqeSZGkqCaRdjmZwQSEi560',
  })

  const onLoad = useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(center)
    // map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const { data } = useQuery({
    queryKey: ['track-cars'],
    queryFn: async () => (await api.get('/admin/booking/active-booking-cars')).data
  })

  useEffect(() => {
    const handleLocationUpdate = (loc) => {
      console.log('change')
      const { userId, lat, lng } = loc;

      if (selected?.user?.id == userId) {
        setSelected((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            location: {
              ...prev.user.location,
              lat,
              lng,
              updatedAt: new Date().toISOString(),
            }
          }
        }))
      }

      setList((prev) => {
        // Find index of the user to update
        const index = prev.findIndex((d) => d.user.id === userId);
        if (index === -1) return prev; // no changes if user not found

        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          user: {
            ...updated[index].user,
            location: {
              ...updated[index].user.location,
              lat,
              lng,
              updatedAt: new Date().toISOString(),
            },
          },
        };

        return updated;
      });
    };

    socket.on('location_update', handleLocationUpdate)

    return () => socket.off('location_update')
  }, [list])

  useEffect(() => {
    if (data) {
      setList(data)
    }
    if (id) {
      const booking = list?.find((x) => x?.id == id)||null
      setSelected(booking)
      setTimeout(() => {
        const loc = booking?.user?.location
        if (map) {
          map.panTo({ lat: parseFloat(loc?.lat), lng: parseFloat(loc?.lng) })
        }
      }, 500)
    }
  }, [id, data])
  
  const markSelected = useCallback(() => {
    const loc = selected?.user?.location
    return { lat: parseFloat(loc?.lat), lng: parseFloat(loc?.lng) }
  }, [selected])

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className='bg-base-300 w-full h-screen py-10'>
      <Container>
        <div className='space-y-8'>
          <div className="card bg-base-100">
            <div className="card-body">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Available Car to track</legend>
                <div className='flex gap-2 items-center'>
                  <select className='select w-1/3' value={id} onChange={(e) => setId(e.target.value)}>
                    <option value="" disabled>Select client</option>
                    {list?.map((d, i) => (
                      <option key={i} value={d?.id}>
                        {d?.car?.make} {d?.car?.model} {d?.car?.year} - {d?.user?.firstName} {d?.user?.lastName}
                      </option>
                    ))}
                  </select>
                  {/* <button className='btn btn-primary'>
                    Track vehicle
                  </button> */}
                </div>
                <p className="label">Track cars that in-progress booking today</p>
              </fieldset>
            </div>
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  streetViewControl: false,
                }}
              >
                {selected && <Marker position={markSelected()} />}
              </GoogleMap>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
