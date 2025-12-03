import type React from "react";

import { useState, useEffect } from "react";
import type { Product } from "../../context/ProductContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Product, "id">) => void;
  product: Product | null;
}

const categories = ["Artistas", "Calaveras", "Carros", "Urbanos ", "Motos"];
const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "/diverse-fashion-display.png",
    category: "Tops",
    sizes: ["S", "M", "L"],
    stock: 10,
    featured: false,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        sizes: product.sizes,
        stock: product.stock,
        featured: product.featured,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        image: "/diverse-fashion-display.png",
        category: "Tops",
        sizes: ["S", "M", "L"],
        stock: 10,
        featured: false,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-card-foreground">
            {product ? "Editar Producto" : "Añadir Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nombre del Producto
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-input border-border text-foreground"
              placeholder="Ingresa el nombre del producto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-input border-border text-foreground resize-none"
              placeholder="Ingresa la descripción del producto"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">
                Precio ($)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-foreground">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                className="bg-input border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Categoría
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="text-popover-foreground"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Tallas Disponibles</Label>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 text-sm font-medium border transition-colors ${
                    formData.sizes.includes(size)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-foreground">
              URL de Imagen
            </Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="bg-input border-border text-foreground"
              placeholder="Ingresa la URL de la imagen"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: checked as boolean })
              }
            />
            <Label
              htmlFor="featured"
              className="text-foreground cursor-pointer"
            >
              Producto Destacado
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {product ? "Guardar Cambios" : "Añadir Producto"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
