class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name
      t.string :username
      t.string :password
      t.string :phone
      t.string :email
      t.string :address
      t.integer :gender
      t.references :type_users, foreign_key: true
      t.integer :role, null: false, default: 0

      t.timestamps
    end
  end
end
