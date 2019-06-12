class CreateProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :products do |t|
      t.string :name
      t.string :description_sort
      t.text :description_long
      t.string :image
      t.string :color
      t.string :size
      t.float :price_in
      t.float :price_out
      t.float :price_sale
      t.integer :status, null: false, default: 0
      t.references :small_categories, foreign_key: true

      t.timestamps
    end
  end
end
