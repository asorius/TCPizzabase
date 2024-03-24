import { Pizza } from '@server/entities/pizza'
import { TRPCError } from '@trpc/server'
import { DataSource } from 'typeorm'

async function filterByCountry({ name, db }: { name: string; db: DataSource }) {
  const pizzas = await db.getRepository(Pizza).find({
    where: {
      brand: {
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
export default filterByCountry
