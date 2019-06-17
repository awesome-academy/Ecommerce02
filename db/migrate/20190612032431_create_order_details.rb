class CreateOrderDetails < ActiveRecord::Migration[5.2]
  def change
    create_table :order_details do |t|
      t.integer :quanitily
      t.float :price
      t.references :order, foreign_key: true
      t.references :product, foreign_key: true
      t.references :history, foreign_key: true

      t.timestamps
    end
  end
end
