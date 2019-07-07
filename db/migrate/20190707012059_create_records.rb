class CreateRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :records do |t|
      t.string :name
      t.string :content
      t.string :prize
      t.string :mentor
    end
  end
end
