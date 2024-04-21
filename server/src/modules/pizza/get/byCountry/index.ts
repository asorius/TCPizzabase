import { Pizza } from '@server/entities/pizza'
import { TRPCError } from '@trpc/server'
import { DataSource } from 'typeorm'

async function filterByCountry({
  name,
  db,
  page = 0,
}: {
  name: string
  db: DataSource
  page: number
}) {
  const pizzas = await db.getRepository(Pizza).find({
    where: {
      brand: {
        country: {
          name,
        },
      },
    },
    relations: ['user', 'brand', 'images', 'brand.country', 'brand.pizzas'],
    skip: page * 10,
    take: 10,
  })
  if (!pizzas) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No pizzas were found`,
    })
  }
  return pizzas
}
export default filterByCountry
