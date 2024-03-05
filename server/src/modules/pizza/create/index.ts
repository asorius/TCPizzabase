import { Brand, Country, Image, User } from '@server/entities'
import { Pizza, pizzaInsertSchema } from '@server/entities/pizza'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure

  .input(pizzaInsertSchema)

  .mutation(async ({ input: userInput, ctx: { authUser, db } }) => {
    const user = await db.getRepository(User).findOne({
      where: {
        id: authUser.id,
      },
    })
    // rating brand country must be provided as strings, but schema is not set like that
    // HOW TO HANDLE IF PASSED IN COUNTRY AND BRAND ALREADY EXIST? WHEN TO CREATE NEW BRAND OR COUNTRY??

    if (!user) {
      throw new Error('No user found')
    }
    // Find saved related entities or create new ones
    let country = await db.getRepository(Country).findOne({
      where: {
        name: userInput.country,
      },
    })
    if (!country) {
      country = new Country()
      country.name = userInput.country
    }

    let brand = await db.getRepository(Brand).findOne({
      where: {
        title: userInput.brand,
      },
    })
    if (!brand) {
      brand = new Brand()
      brand.title = userInput.brand
    }
    // A new Image entity is always created to add it to the already existing list
    const image = new Image()
    image.rating = userInput.rating
    image.user = user
    image.source = userInput.imageSource

    // Construct the final Pizza entity with relations
    const pizza = new Pizza()
    pizza.user = user
    pizza.name = userInput.name
    pizza.brand = brand
    pizza.images = [image]

    // Maybe not needed, not sure
    image.pizza = pizza

    const createdPizza = await db.getRepository(Pizza).save(pizza)

    return createdPizza
  })
