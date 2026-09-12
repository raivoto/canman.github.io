   // Gridis
   <img src={product.thumbnail || product.gridImage || product.image} />
   
   // Detailvaates galerii
   {product.gallery.map(img => <img src={img} />)}
