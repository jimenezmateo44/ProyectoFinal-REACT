import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getDocs, collection, query } from 'firebase/firestore';
import { db } from '../../services/config';

const ResultadoBusqueda = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const busqueda = queryParams.get('query') || '';

  const [productos, setProductos] = useState([]);


  useEffect(() => {
    const buscarProductos = async () => {
      const busquedaUpperCase = busqueda.toUpperCase();
      try {
        const misProductos = query(
          collection(db, 'inventario')
        );

        const productosSnapshot = await getDocs(misProductos);

        const nuevosProductos = productosSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((producto) => producto.nombre.includes(busquedaUpperCase));

        setProductos(nuevosProductos);

      } catch (error) {
        
      }
    };

    if (busqueda.trim() !== '') {
      buscarProductos();
    } else {
      // Restablecer productos si la búsqueda está vacía
      setProductos([]);
    }
  }, [busqueda]);

  return (
    <div className='mt-[3.5rem] flex flex-col items-center justify-evenly flex-wrap gap-10 h-fit bg-[#f1f2f3] lg:h-screen'>
      <h1 className='mt-[6rem] font-paytone font-bold text-2xl lg:hidden'>Resultados de tu busqueda</h1>
      {productos.map((producto) => (
        <div key={producto.id} className='p-4 bg-white mb-5'>
          <Link to={`/producto/${producto.id}`}>
            <img
              className='h-[300px] cursor-pointer'
              src={producto.imagen}
              alt={producto.nombre}
            />
          </Link>

          <h1 className='text-lg text-center font-semibold font-sans'>{producto.nombre}</h1>
          <div className='flex flex-col gap-2 items-start mt-5 ml-3'>
            <h2 className='text-[2rem] text-center font-antonio font-bold'>${producto.precio}</h2>
            <p className='font-antonio'>3 cuotas sin interes de: ${Math.floor(producto.precio / 3)}</p>
            <p className='font-mono font-bold text-[#D24e01]'>ENVIO GRATIS</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultadoBusqueda;
