class ViewWebController < ApplicationController
  def home
    @products = Product.joins("INNER JOIN ranks ON product_id = products.id").limit(12).order("star_level desc")
  end

  def about
  end

  def contacts
  end

  def product
  end

  def collections
  end

  def login
  end

  def account
  end

  def cart
  end
end
