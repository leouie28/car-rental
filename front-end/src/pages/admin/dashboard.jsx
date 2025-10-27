import Container from '../../components/Container'
import { Car, CircleUser, Clock, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function AdminDashboardPage() {

  const { data: overview, isFetching: overviewLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => (await api.get('/admin/report/overview')).data,
  })

  return (
    <div className="py-10 min-h-screen">
      <Container>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          </div>
          <div className='space-y-4 print:hidden'>
            <h3>Overview</h3>
            <div className='grid grid-cols-2 md:flex gap-6 flex-wrap'>
              <div className="card bg-base-100 w-full md:w-52 print:border border-gray-300">
                <div className="card-body">
                  <Users />
                  <div>
                    Total Customers: <span className='font-semibold'>{overview?.clients}</span>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 w-full md:w-52 print:border border-gray-300">
                <div className="card-body">
                  <Car />
                  <div>
                    Total Cars: <span className='font-semibold'>{overview?.cars}</span>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 w-full md:w-52 print:border border-gray-300">
                <div className="card-body">
                  <CircleUser />
                  <div>
                    Total Drivers: <span className='font-semibold'>{overview?.drivers}</span>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 w-full md:w-52 print:border border-gray-300">
                <div className="card-body">
                  <Clock />
                  <div>
                    Total Booking: <span className='font-semibold'>{overview?.bookings}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
