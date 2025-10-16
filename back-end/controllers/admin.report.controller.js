import prisma from "../lib/prismaClient.js"
import dayjs from 'dayjs'

export const getOverview = async (req, res) => {
  try {
    const cars = await prisma.car.count({
      where: { deletedAt: null }
    })

    const drivers = await prisma.driver.count()

    const bookings = await prisma.booking.count()

    const clients = await prisma.user.count({
      where: { isAdmin: false }
    })

    res.status(200).json({
      cars,
      drivers,
      bookings,
      clients
    })
    
  } catch (error) {
    console.log('Error on getCars:', error);
    res.status(500).send(error || 'Server Error');
  }
}

const comleteDays = (start, end) => {
  let days = []
  let current = dayjs(start)

  while(!current.isAfter(dayjs(end))) {
    days.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }

  return days
} 

export const getDetailed = async (req, res) => {
  try {
    const start = dayjs(req.query.start).format('YYYY-MM-DD')
    const end = dayjs(req.query.end).format('YYYY-MM-DD')
    const days = comleteDays(start, end)

    const [rawPerTotal, booking, income] = await Promise.all([
      prisma.$queryRaw`
      SELECT
        DATE("createdAt") as date,
        COUNT("id") as total
      FROM
        "booking"
      WHERE
        DATE("createdAt") BETWEEN ${start}::date AND ${end}::date
      GROUP BY
        DATE("createdAt")
      ORDER BY
        DATE("createdAt") ASC;`,
      prisma.booking.findMany({
        where: {
          status: {
            in: ['completed', 'paid', 'confirmed']
          },
          updatedAt: {
            gte: dayjs(start).startOf('day').toDate(),
            lte: dayjs(end).endOf('day').toDate(),
          }
        },
        include: { car: true, user: true, driver: true },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.booking.groupBy({
        by: ['withDriver'],
        where: {
          status: {
            in: ['completed', 'paid', 'confirmed']
          },
        },
        _sum: {
          totalPrice: true
        }
      })
    ])
    
    const perTotalMapped = new Map(rawPerTotal.map((r) => [dayjs(r.date).format('YYYY-MM-DD'), Number(r.total)]))
    const parsedIncome = income.map((d) => ({ withDriver: d.withDriver, total: Number(d._sum.totalPrice) }))
    res.status(200).json({
      linedata: [...days].map((date) => ({ date, total: perTotalMapped.get(date) || 0 })),
      booking,
      income: { withDriver: parsedIncome.find((x) => x.withDriver).total, selfDrive: parsedIncome.find((x) => !x.withDriver).total } 
    })
    
  } catch (error) {
    console.log('Error on getCars:', error);
    res.status(500).send(error || 'Server Error');
  }
}