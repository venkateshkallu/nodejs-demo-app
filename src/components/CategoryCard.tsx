import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/products?category=${category.id}`}>
      <Card className="overflow-hidden product-card-hover cursor-pointer">
        <div className="aspect-video overflow-hidden bg-muted relative">
          <img
            src={category.image_url}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
            <p className="text-sm text-white/90">{category.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
