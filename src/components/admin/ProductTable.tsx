import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../context/ProductContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-muted-foreground">Producto</TableHead>
            <TableHead className="text-muted-foreground">Categoría</TableHead>
            <TableHead className="text-muted-foreground">Precio</TableHead>
            <TableHead className="text-muted-foreground">Stock</TableHead>
            <TableHead className="text-muted-foreground">Tallas</TableHead>
            <TableHead className="text-muted-foreground text-right">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-muted rounded overflow-hidden shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {product.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {product.category}
              </TableCell>
              <TableCell className="text-foreground font-medium">
                ${product.price}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                    product.stock < 10
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {product.stock} unidades
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {product.sizes.join(", ")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-card-foreground">
                          Eliminar Producto
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          ¿Estás seguro de que quieres eliminar "{product.name}
                          "? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border text-foreground hover:bg-muted">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(product.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
