# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# categories = Category.create(name: "categories1",description: "sjdgfsjd")
# users = User.create(name: "Duc Vinh",
#   username: "DucVinh2609",
#   password: "123123",
#   phone: "0787073046",
#   email: "ducvinhnguyen2609@gmail.com",
#   address: "Da Nang",
#   gender: 0)
#   users = User.create(name: "Duc Vinh 123",
#   email: "ducvinhnguyen2609@gmail.com",
#   password: "123123")

# contacts = Contact.create(users_id: 1,message: "sydgasda")

# categories = Category.create(name: "TOPS",description: "tops")
# categories = Category.create(name: "BOTTOMS",description: "bottoms")
# categories = Category.create(name: "ACCESSORIES",description: "accessories")

categories = Category.create(name: "Ao", description: "ao mat")
categories = Category.create(name: "quan", description: "quan mat")

small_categories = SmallCategory.create(small_category_name: "Ao lot", description: "de mat", category_id: 1)
small_categories = SmallCategory.create(small_category_name: "quan lot", description: "de mat", category_id: 2)

