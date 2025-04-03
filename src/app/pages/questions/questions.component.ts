import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import Swal from 'sweetalert2';
import { QuestionsService } from './questions.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions.component.html',
  imports: [ReactiveFormsModule, CommonModule, InputTextModule],
  standalone: true,
  styleUrls: ['./questions.component.scss'],
  animations: [
    trigger('selectedAnimation', [
      transition(':enter', [
        // Se parte de opacidad 0
        style({ opacity: 0 }),
        // Se anima a opacidad 1 y se aplica la transformación final
        animate('{{ enterTime }} ease-in', style({ opacity: 1, transform: '{{ enterTransform }}' }))
      ], { params: { enterTime: '300ms', enterTransform: 'translateX(0)' } }),
      transition(':leave', [
        // Se anima a opacidad 0 y se aplica la transformación de salida
        animate('{{ leaveTime }} ease-out', style({ opacity: 0, transform: '{{ leaveTransform }}' }))
      ], { params: { leaveTime: '300ms', leaveTransform: 'translateX(100%)' } })
    ])
  ]
})
export default class QuestionsComponent {
  questionsForm: FormGroup;
  currentStep = 0;
  totalSteps = 5;

  // Array de opciones de animación (parámetros)
  animationOptions = [
    { enterTime: '300ms', enterTransform: 'translateX(0)', leaveTime: '300ms', leaveTransform: 'translateX(-100%)' },
    { enterTime: '400ms', enterTransform: 'translateY(0)', leaveTime: '400ms', leaveTransform: 'translateY(100%)' },
    { enterTime: '300ms', enterTransform: 'scale(1)', leaveTime: '300ms', leaveTransform: 'scale(0.5)' },
    { enterTime: '500ms', enterTransform: 'rotate(0)', leaveTime: '500ms', leaveTransform: 'rotate(20deg)' }
  ];
  // Inicialmente se asigna la primera opción
  currentAnimationParams = this.animationOptions[0];

  private questionsService = inject(QuestionsService);

  // Opciones para la sección de Información Personal (selects)
  educationZones = ['rural', 'urbana', 'no se'];
  institutionTypes = ['publico', 'privado', 'no se'];

  // Opciones para las secciones de asignaturas, razones, recursos y cambios
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
    'Entorno ambiental (El lugar y las condiciones del entorno)', 'Otra ¿Cuál?'
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

    // Validación condicional para favoriteSubjects.otherSubject
    this.questionsForm.get('favoriteSubjects.subject')?.valueChanges.subscribe(value => {
      const otherSubjectControl = this.questionsForm.get('favoriteSubjects.otherSubject');
      if (value === 'Otra') {
        otherSubjectControl?.setValidators(Validators.required);
      } else {
        otherSubjectControl?.clearValidators();
        otherSubjectControl?.setValue('');
      }
      otherSubjectControl?.updateValueAndValidity();
    });

    // Validación condicional para favoriteSubjects.otherReason
    this.questionsForm.get('favoriteSubjects.reason')?.valueChanges.subscribe(value => {
      const otherReasonControl = this.questionsForm.get('favoriteSubjects.otherReason');
      if (value === 'Otra ¿Cuál?') {
        otherReasonControl?.setValidators(Validators.required);
      } else {
        otherReasonControl?.clearValidators();
        otherReasonControl?.setValue('');
      }
      otherReasonControl?.updateValueAndValidity();
    });

    // Validación condicional para leastFavoriteSubjects.otherReason
    this.questionsForm.get('leastFavoriteSubjects.reason')?.valueChanges.subscribe(value => {
      const otherReasonControl = this.questionsForm.get('leastFavoriteSubjects.otherReason');
      if (value === 'Otro ¿Cuál?') {
        otherReasonControl?.setValidators(Validators.required);
      } else {
        otherReasonControl?.clearValidators();
        otherReasonControl?.setValue('');
      }
      otherReasonControl?.updateValueAndValidity();
    });

    // Validación condicional para learningResources.otherResource
    this.questionsForm.get('learningResources.resource')?.valueChanges.subscribe(value => {
      const otherResourceControl = this.questionsForm.get('learningResources.otherResource');
      if (value === 'Otro ¿Cuál?') {
        otherResourceControl?.setValidators(Validators.required);
      } else {
        otherResourceControl?.clearValidators();
        otherResourceControl?.setValue('');
      }
      otherResourceControl?.updateValueAndValidity();
    });

    // Validación condicional para teachingChanges.otherChange
    this.questionsForm.get('teachingChanges.change')?.valueChanges.subscribe(value => {
      const otherChangeControl = this.questionsForm.get('teachingChanges.otherChange');
      if (value === 'Otra') {
        otherChangeControl?.setValidators(Validators.required);
      } else {
        otherChangeControl?.clearValidators();
        otherChangeControl?.setValue('');
      }
      otherChangeControl?.updateValueAndValidity();
    });
  }

  // Método para regresar a la página anterior
  volverAtras() {
    this.location.back();
  }

  // Helper para saber si un control es inválido y ha sido tocado
  isInvalid(groupName: string, controlName: string): boolean {
    const control = this.questionsForm.get(`${groupName}.${controlName}`);
    return control ? control.touched && control.invalid : false;
  }

  // Función para seleccionar una animación aleatoria
  private selectRandomAnimation() {
    const randomIndex = Math.floor(Math.random() * this.animationOptions.length);
    this.currentAnimationParams = this.animationOptions[randomIndex];
  }

  // Navegar al siguiente paso y seleccionar una animación aleatoria
  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.selectRandomAnimation();
    }
  }

  // Navegar al paso anterior y seleccionar una animación aleatoria
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.selectRandomAnimation();
    }
  }

  async submitForm() {
    // Marcar todos los controles como tocados
    this.questionsForm.markAllAsTouched();

    if (this.questionsForm.valid) {
      const formData = this.questionsForm.value;
      try {
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
        // Resetear el formulario y volver al primer paso
        this.questionsForm.reset();
        this.currentStep = 0;
      } catch (error) {
        console.error('Error al insertar los datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar tu respuesta. Inténtalo de nuevo.'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        html: `<p>Por favor, completa los campos obligatorios correctamente.</p>`
      });
    }
  }
}
