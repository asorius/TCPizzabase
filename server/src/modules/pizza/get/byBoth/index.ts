import { Pizza } from '@server/entities/pizza'
import { TRPCError } from '@trpc/server'
import { DataSource } from 'typeorm'

async function filterByBoth({
  brand,
  country,
  db,
  page = 0,
}: {
  brand: string
  country: string
  db: DataSource
  page: number
}) {
  const title = brand
  const name = country

  const pizzas = await db.getRepository(Pizza).find({
    where: {
      brand: {
        title,
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
export default filterByBoth
