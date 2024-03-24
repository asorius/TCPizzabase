import { Pizza } from '@server/entities/pizza'
import { TRPCError } from '@trpc/server'
import { DataSource } from 'typeorm'

async function filterByBrand({
  brand,
  country,
  db,
}: {
  brand: string
  country: string
  db: DataSource
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
  })
  if (!pizzas) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No pizzas were found`,
    })
  }

  return pizzas
}
export default filterByBrand
