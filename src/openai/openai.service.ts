import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { FileService } from 'src/file/file.service';

@Injectable()
export class OpenaiService {
  constructor(
    private readonly openai: OpenAI,
    private readonly fileService: FileService,
  ) {}
  async createChatCompletion(messages: any[]) {
    try {
      console.log('Creando chat completion con OpenAI');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
      });

      console.log('Chat completion creado exitosamente');
      console.log('Respuesta:', response.choices[0].message.content);
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error creando chat completion:', error);
      throw error;
    }
  }

  async analyzeImages(imagePaths: string[]) {
    try {
      const encodedImages = await Promise.all(
        imagePaths.map(async (imagePath) => {
          const encodedImage =
            await this.fileService.encodeImageToBase64(imagePath);
          return {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${encodedImage}` },
          };
        }),
      );

      const aiResponse = await this.createChatCompletion([
        {
          role: 'system',
          content:
            'Eres un experto en extraer y comparar datos de múltiples cotizaciones, con una habilidad especial para reconocer productos similares aunque tengan nombres diferentes. Tu tarea es analizar cotizaciones y generar una tabla comparativa precisa.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza las cotizaciones adjuntas y genera una tabla comparativa. Sigue estrictamente este formato:
      
      No. | Detalle | Cantidad | (Proveedor 1) Precio Unitario | (Proveedor 1) Precio Total | (Proveedor 2) Precio Unitario | (Proveedor 2) Precio Total | ... | (Proveedor N) Precio Unitario | (Proveedor N) Precio Total
      
      Instrucciones específicas:
      1. Incluye todos los productos de todas las cotizaciones en la tabla.
      2. Usa los nombres exactos de los proveedores como aparecen en las cotizaciones para los encabezados de las columnas.
      3. Ordena los items por número de item en orden ascendente.
      4. Si un proveedor no ofrece un producto específico, usa 'N/A' en sus celdas de precio.
      5. Si solo hay una cotización, incluye solo columnas para ese proveedor.
      6. Mantén la precisión decimal de los precios tal como aparecen en las cotizaciones.
      7. Asegúrate de que todos los datos estén correctamente alineados en sus respectivas columnas.
      8. Asegúrate de que cada producto esté correctamente emparejado entre las diferentes cotizaciones, incluso si los nombres difieren ligeramente pero se refieren al mismo artículo. Ejemplos de emparejamientos correctos:
         - 'Producto A' en una cotización debe emparejarse con 'A' en otra cotización.
         - 'Producto B' en una cotización debe emparejarse con 'B' en otra cotización.
         - 'UAPC-AC-M-PRO' se empareja con 'UBIQUITI UNIFI AP U6 LR LONG RANGE DUAL BAND MIMO 4X4 GIGABIT WI-FI 6'.
         - 'CABLE DE CONEXIÓN UTP PREMIUM CAT6' se empareja con 'cable utp cat 6a ftp'.
         - 'RB3011UIAS-RM' se empareja con 'MIKROTIK ROUTERBOARD 3011 DUAL CORE 1.4GZ 1GB 10X GIGABIT PANTALLA LCD USB PUERTO SFP ROUTEROS L5'.
      9. Considera sinónimos y términos técnicos equivalentes al emparejar productos. Por ejemplo:
         - 'Router' puede emparejarse con 'Enrutador' o 'Gateway'.
         - 'Switch' puede emparejarse con 'Conmutador'.
         - 'Access Point' puede emparejarse con 'Punto de Acceso' o 'AP'.
         - 'UPS' puede emparejarse con 'Sistema de Alimentación Ininterrumpida' o 'Batería de Respaldo'.
      10. Ten en cuenta las especificaciones técnicas al emparejar productos. Productos con especificaciones similares (como velocidad, capacidad, potencia) deben considerarse equivalentes aunque sus nombres comerciales difieran.
      11. La respuesta debe estar siempre en formato de texto plano.
      12. La respuesta debe contener solo la tabla solicitada sin ningún texto adicional.
      
      Recuerda: Tu objetivo principal es proporcionar una comparación precisa y útil, identificando correctamente productos equivalentes entre las diferentes cotizaciones.`,
            },
            ...encodedImages,
          ],
        },
      ]);

      // Clean up uploaded files
      await this.fileService.cleanUploadDir();

      return aiResponse;
    } catch (error) {
      console.error('Error analyzing images:', error);
      throw error;
    }
  }
}
