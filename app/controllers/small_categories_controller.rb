class SmallCategoriesController < ApplicationController
  before_action :load_small_category, except: [:new, :index, :create]
  def index
  	@small_categories = SmallCategory.all
  	@categories = Category.all
  end

  def new
  	@small_category = SmallCategory.new
  	@categories = Category.all
  end

  def edit
  	@categories = Category.all
  end

  def create
    @small_category = SmallCategory.new small_category_params
    if @small_category.save
      redirect_to small_categories_path
    else
      render :new
    end
  end

  def update
    if @small_category.update_attributes(small_category_params)
      flash[:success] = t "updated"
      redirect_to small_categories_path
    else
      render :edit
    end
  end

  def destroy
    if @small_category.destroy
      flash[:success] = t "small_category_deleted"
      redirect_to categories_path
    else
      flash[:danger] = t "small_category_not_found"
      redirect_to categories_path
    end
  end

  private

    def small_category_params
      params.require(:small_category).permit(:small_category_name, :description, :category_id)
    end

    def load_small_category
      @small_category = SmallCategory.find_by id: params[:id] 
      return if @small_category

      flash[:danger] = t "small_category_not_found"
      redirect_to root_path
    end
end
