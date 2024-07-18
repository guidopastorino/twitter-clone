import bcrypt from 'bcrypt';

// Función para enmascarar un ID de MongoDB a un string alfanumérico usando bcrypt
const generateMaskedPostId = async (mongoId: string): Promise<string> => {
  // Generar un hash con bcrypt usando un costo de 10
  const saltRounds = 10;
  const hash = await bcrypt.hash(mongoId, saltRounds);

  // Usar solo una parte del hash para la representación del ID
  // Reemplazar caracteres no alfanuméricos y tomar una parte del hash
  const maskedId = hash.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);

  return maskedId;
};

export default generateMaskedPostId;