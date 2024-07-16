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
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza las imágenes de proformas de proveedores adjuntas y genera una tabla comparativa sin texto adicional. La tabla debe seguir estrictamente este formato:

              No. Item | Detalle | Cantidad | (Proveedor 1) Precio Unitario | (Proveedor 1) Precio Total | (Proveedor 2) Precio Unitario | (Proveedor 2) Precio Total | ... | (Proveedor N) Precio Unitario | (Proveedor N) Precio Total

              Instrucciones específicas:

              Incluye todos los productos de todas las proformas en la tabla.
              Usa los nombres exactos de los proveedores como aparecen en las proformas para los encabezados de las columnas.
              Ordena los ítems por número de ítem de forma ascendente.
              Si un proveedor no ofrece un producto específico, deja sus celdas de precio en blanco.
              Si solo hay una proforma, incluye solo las columnas para ese proveedor.
              Mantén la precisión decimal de los precios tal como aparecen en las proformas.
              No agregues notas, explicaciones o cualquier otro texto fuera de la tabla.
              Asegúrate de que todos los datos estén alineados correctamente en sus respectivas columnas.

              La respuesta debe contener únicamente la tabla solicitada, sin introducción, conclusión o comentarios adicionales.`,
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
