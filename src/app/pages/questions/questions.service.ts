        import { Injectable } from '@angular/core';
        import { SupabaseService } from '../../service/supabase.service'; // Asegúrate de ajustar la ruta según tu estructura

        @Injectable({
        providedIn: 'root'
        })
        export class QuestionsService {

        constructor(private supabaseService: SupabaseService) { }

        /**
        * Inserta una respuesta de la encuesta en la base de datos.
        * @param data Objeto con los datos de la encuesta.
        * @returns Una promesa con la respuesta de Supabase o error.
        */
        async insertSurveyResponse(data: any): Promise<any> {
            const { data: responseData, error } = await this.supabaseService.supabaseClient
            .from('survey_responses')
            .insert([data]);

            if (error) {
            throw error;
            }
            return responseData;
        }
        async getUsers() {
            const { data, error } = await this.supabaseService.supabaseClient
            .from('survey_responses') // 🛠 Cambiado de 'users' a 'survey_responses'
            .select('*');

            if (error) {
            console.error('Error obteniendo respuestas de encuestas:', error);
            return [];
            }
            return data || [];
        }

        }
