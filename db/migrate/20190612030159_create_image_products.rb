class CreateImageProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :image_products do |t|
      t.string :image
      t.references :product, foreign_key: true

      t.timestamps
    end
  end
end
