class CreateOrderDetails < ActiveRecord::Migration[5.2]
  def change
    create_table :order_details do |t|
      t.integer :quanitily
      t.float :price
      t.references :orders, foreign_key: true
      t.references :products, foreign_key: true
      t.references :histories, foreign_key: true

      t.timestamps
    end
  end
end
