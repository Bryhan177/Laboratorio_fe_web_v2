import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import Swal from 'sweetalert2';
import { QuestionsService } from './questions.service';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions.component.html',
  imports: [ReactiveFormsModule, CommonModule, InputTextModule],
  standalone: true,
  styleUrls: ['./questions.component.scss']
})
export default class QuestionsComponent {
  questionsForm: FormGroup;

  private questionsService = inject(QuestionsService);

  // Opciones para la sección de Información Personal (para selects)
  educationZones = ['rural', 'urbana', 'no se'];
  institutionTypes = ['publico', 'privado', 'no se'];

  // Opciones para la sección de asignaturas y áreas
  favoriteSubjectsOptions = [
    'Geometría', 'Trigonometría', 'Estadística', 'Calculo', 'Algebra', 'Contabilidad',
    'Matemáticas', 'Biología', 'Química', 'Física', 'Ciencias naturales', 'Humanidades',
    'Español', 'Ingles', 'Comprensión Lectora', 'Ciencias sociales', 'Catedra de la Paz',
    'Constitución Política', 'Democracia', 'Estudios de Afrocolombianidad',
    'Formación vial y seguridad ciudadana', 'Filosofía', 'Educación Física', 'Ética',
    'Artística', 'Tecnología e Informática', 'Religión', 'Pedagogía', 'Otra'
  ];

  favoriteReasonsOptions = [
    'Interés/ pasión/ vocación/motivación', 'Conocimiento/aprendizaje',
    'Interrelación (Las conexiones con otras personas y cómo interactúas con ellas)',
    'Experiencias/ vivencias', 'Expresión creativa',
    'Ejecución de habilidades teóricas o practicas (Poner en práctica lo que sabes)',
    'Desarrollo del ser (Crecer como persona y mejorar en todos los aspectos de tu vida)',
    'Metodológico/didáctico (Los métodos o formas de enseñar y aprender, cómo organizar las cosas para entenderlas mejor)',
    'Entorno ambiental (El lugar y las condiciones del entorno)', 'Otra – ¿cuál?'
  ];

  leastFavoriteSubjectsOptions = [
    'Geometría', 'Trigonometría', 'Estadística', 'Calculo', 'Algebra', 'Contabilidad',
    'Matemáticas', 'Biología', 'Química', 'Física', 'Ciencias naturales', 'Humanidades',
    'Español', 'Ingles', 'Comprensión Lectora', 'Ciencias sociales', 'Catedra de la Paz',
    'Constitución Política', 'Democracia', 'Estudios de Afrocolombianidad',
    'Formación vial y seguridad ciudadana', 'Filosofía', 'Educación Física', 'Ética',
    'Artística', 'Tecnología e Informática', 'Religión', 'Pedagogía'
  ];

  leastFavoriteReasonsOptions = [
    'Dificultad de aprendizaje', 'Metodología/didáctica (Los métodos o formas de enseñar y aprender, cómo organizar las cosas para entenderlas mejor)',
    'Conocimiento/ aprendizaje', 'Ejecución de habilidades/teórico- práctico (Poner en práctica lo que sabes)',
    'Interés/vocación/ pasión/motivación',
    'Ubicación espacial/infraestructura/ condiciones materiales del escenario/contexto',
    'Entorno ambiental (El lugar y las condiciones del entorno)', 'Otro ¿Cuál?'
  ];

  learningResourcesOptions = [
    'Lectura', 'Ejercicios prácticos', 'Recursos didácticos', 'Técnicas digitales',
    'Acompañamiento personalizado', 'Escritura',
    'Metodología / Didáctica (Los métodos o formas de enseñar y aprender, cómo organizar las cosas para entenderlas mejor)',
    'Ejecución de habilidades / Teórico práctico (Poner en práctica lo que sabes)',
    'Interrelación / Interacción (Las conexiones con otras personas y cómo interactúas con ellas)',
    'Desarrollo del ser (Crecer como persona y mejorar en todos los aspectos de tu vida)',
    'Interés / Pasión / Vocación / Motivación',
    'Entorno ambiental (El lugar y las condiciones del entorno)', 'Otro ¿Cuál?'
  ];

  teachingChangesOptions = [
    'Metodología / Didáctica (Los métodos o formas de enseñar y aprender, cómo organizar las cosas para entenderlas mejor)',
    'Acompañamiento personalizado', 'Intención pedagógica', 'Optimizar el tiempo de clase',
    'Educador/Profesor', 'Implementar técnicas digitales', 'Forma de evaluación',
    'Fomentar la ejecución de habilidades / Teórico práctico (Poner en práctica lo que sabes)',
    'Implementar actividades extracurriculares', 'Implementar orientación vocacional',
    'Fomentar capacidades para la vida', 'Otra'
  ];

  constructor(private fb: FormBuilder, private location: Location) {
    this.questionsForm = this.fb.group({
      personalInfo: this.fb.group({
        institution: ['', Validators.required],
        educationZone: ['', Validators.required],
        institutionType: ['', Validators.required],
        country: ['', Validators.required],
        municipality: ['', Validators.required],
        gradeYear: ['', Validators.required]
      }),
      favoriteSubjects: this.fb.group({
        subject: ['', Validators.required],
        otherSubject: [''],
        reason: ['', Validators.required],
        otherReason: ['']
      }),
      leastFavoriteSubjects: this.fb.group({
        subject: ['', Validators.required],
        reason: ['', Validators.required],
        otherReason: ['']
      }),
      learningResources: this.fb.group({
        resource: ['', Validators.required],
        otherResource: ['']
      }),
      teachingChanges: this.fb.group({
        change: ['', Validators.required],
        otherChange: ['']
      }),
    });
  }

  // Método para retroceder a la página anterior
  volverAtras() {
    this.location.back();
  }

  // Helper para saber si un control es inválido y ha sido tocado
  isInvalid(groupName: string, controlName: string): boolean {
    const control = this.questionsForm.get(`${groupName}.${controlName}`);
    return control ? control.touched && control.invalid : false;
  }

  async submitForm() {
    // Marcar todos los controles como tocados para activar los mensajes de error
    this.questionsForm.markAllAsTouched();

    if (this.questionsForm.valid) {
      // Opcional: establecer un estado de "enviando" para deshabilitar el botón o mostrar un spinner
      // Por ejemplo: this.isSubmitting = true;

      // Extraer los datos del formulario
      const formData = this.questionsForm.value;

      try {
        // Insertar los datos en Supabase usando el QuestionsService
        const response = await this.questionsService.insertSurveyResponse({
          institution: formData.personalInfo.institution,
          education_zone: formData.personalInfo.educationZone,
          institution_type: formData.personalInfo.institutionType,
          country: formData.personalInfo.country,
          municipality: formData.personalInfo.municipality,
          grade_year: formData.personalInfo.gradeYear,
          favorite_subject: formData.favoriteSubjects.subject,
          favorite_other_subject: formData.favoriteSubjects.otherSubject,
          favorite_reason: formData.favoriteSubjects.reason,
          favorite_other_reason: formData.favoriteSubjects.otherReason,
          least_favorite_subject: formData.leastFavoriteSubjects.subject,
          least_favorite_reason: formData.leastFavoriteSubjects.reason,
          least_favorite_other_reason: formData.leastFavoriteSubjects.otherReason,
          learning_resource: formData.learningResources.resource,
          learning_other_resource: formData.learningResources.otherResource,
          teaching_change: formData.teachingChanges.change,
          teaching_other_change: formData.teachingChanges.otherChange,
        });

        console.log('Datos insertados:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Tu respuesta ha sido guardada correctamente.'
        });

        // Reiniciar el formulario a sus valores iniciales y limpiar los estados (dirty, touched, etc.)
        this.questionsForm.reset();

        // Opcional: si tienes valores por defecto, vuelve a asignarlos aquí.
        // Por ejemplo: this.questionsForm.patchValue({ personalInfo: { educationZone: '' } });

      } catch (error) {
        console.error('Error al insertar los datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar tu respuesta. Inténtalo de nuevo.'
        });
      } finally {
        // Opcional: restablecer el estado de "enviando"
        // this.isSubmitting = false;
      }
    } else {
      // Si el formulario no es válido, mostrar un mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        html: `<p>Por favor, completa los campos obligatorios correctamente.</p>`
      });
    }
  }

}
