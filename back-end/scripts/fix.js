  import bcrypt from 'bcryptjs'

  const main = () => {
    try {
      const pass = bcrypt.hashSync("password", 10)
      console.log(pass)
    } catch (error) {
      console.error(error)
    }
  }

  main()