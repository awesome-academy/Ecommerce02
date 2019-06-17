class CreateSmallCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :small_categories do |t|
      t.string :small_category_name
      t.text :description
      t.references :category, foreign_key: true

      t.timestamps
    end
  end
end
