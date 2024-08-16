// services/utils/formatDate.jsx
export function formatTimestampToInputDate(timestamp) {
    if (!timestamp || isNaN(new Date(timestamp))) {
      return ''; // Manejar el caso cuando el timestamp no es válido
    }
    
    const date = new Date(timestamp);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }