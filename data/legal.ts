/**
 * PLACEHOLDERS LEGALES. El contenido debe ser redactado y revisado
 * legalmente según la ubicación real del negocio antes de publicar.
 */
export const legalPages: Record<string, { title: string; sections: string[] }> = {
  privacidad: {
    title: "Aviso de privacidad",
    sections: ["Qué datos recogemos (nombre, teléfono, dirección, correo) y para qué.", "Cómo se almacenan y durante cuánto tiempo.", "Cómo ejercer tus derechos sobre tus datos.", "Uso de cookies, si se utilizan herramientas que lo requieran."],
  },
  terminos: {
    title: "Términos del servicio",
    sections: ["Condiciones de compra y confirmación de pedidos.", "Precios, disponibilidad y cambios en el menú.", "Condiciones de entrega y recogida."],
  },
  pedidos: {
    title: "Política de pedidos",
    sections: ["Cancelaciones y modificaciones.", "Cambios y reembolsos.", "Qué hacer si falta un producto o llega en mal estado."],
  },
  alergenos: {
    title: "Información sobre alérgenos",
    sections: ["Alérgenos declarados por producto.", "Manejo y posible contaminación cruzada, según confirme el restaurante.", "Cómo comunicar una alergia antes de confirmar el pedido."],
  },
};
