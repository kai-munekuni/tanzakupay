require 'bundler/setup'
Bundler.require
require 'sinatra/reloader' if development?
require "json"
require "./models.rb"
require "csv"

mentors_array = ["のこのこ","にーろ","かく","きぃ","しみしみ","なべ","#らぞーな","キャシー","もっちゃん","ぐっちー","まーしー","なかとも","もんすたー。","かいかい"]
prize_array = ["なかともの飴","アイス","ハーゲンダッツ"]
hargen_datz_amount = 3
ice_amout = 7

get '/' do
  puts rand(0..(mentors_array.length - 1))
 erb :index
end

get '/api/prize' do
  response = {
    mentor: mentors_array[rand(0..(mentors_array.length - 1))],
    prize: prize_array[register_result(choose_prize)]
  }
  return json response
end

get "/admin/check" do
  @prizes = Prize.all
  @records = Record.all
  erb :admin
end

post "/admin/resetcount" do
  prize = Prize.find(1)
  prize.count = 0
  prize.save!
  prize = Prize.find(2)
  prize.count = 0
  prize.save!
  prize = Prize.find(3)
  prize.count = 0
  prize.save!
  redirect "/admin/check"
end

post "/post/negai" do
  Record.create(name:params[:name],content:params[:content],mentor:params[:mentor],prize:params[:prize])
end


def register_result(num)
  prize = Prize.find(num + 1)
  prize.count = prize.count + 1
  prize.save!
  return num
end

def choose_prize
  prize_rand_array = [true,false,false,false,false]
  ice_rand_array = [true,true,true,false,false,false,false,false,false,true,false]
  # DBに出ている賞の数を記録する
  # id 3 => datz 2 => ice 1 => ame

  prize_rand_array.shuffle!
  ice_rand_array.shuffle!
  if prize_rand_array[0]
    if ice_rand_array[0]
      return 1 if Prize.find(3).count >= 3 && !Prize.find(2).count >= 7
      return 0 if Prize.find(3).count >= 3 && Prize.find(2).count >= 7
      return 2
    else
      return 0 if Prize.find(2).count >= 7
      return 1
    end
  end
  return 0
end


get "/get/csv" do
  csv1 = CSV.generate do |csv|
    csv << Record.column_names
    Record.all.each do |model|
      csv << model.attributes.values_at(*Record.column_names)
    end
  end
  File.open("./test.csv", 'w') do |file|
    file.write(csv1)
  end
  stat = File::stat("./test.csv")
  send_file("./test.csv", :filename => "test.csv", :length => stat.size)
end