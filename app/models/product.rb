class Product < ApplicationRecord
  belongs_to :small_category
  has_many :image_products
  enum status: { stocking: 0, outofstock: 1 }
end
