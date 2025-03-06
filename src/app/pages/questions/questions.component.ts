import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions.component.html',
  imports: [ReactiveFormsModule, CommonModule, Tooltip, InputTextModule],
  standalone: true,
  styleUrls: ['./questions.component.scss']

})
export default class QuestionsComponent {
  questionsForm: FormGroup;

  subjects = [
    'Matemáticas', 'Geometría', 'Estadística', 'Química', 'Física',
    'Ciencias naturales', 'Ciencias sociales', 'Tecnología e informática',
    'Inglés', 'Español /Lengua castellana /Comprensión lectora', 'Educación física',
    'Religión', 'Ética y valores', 'Pedagogía', 'Artística', 'Filosofía', 'Contabilidad'
  ];

  reasonsToEnjoy = [
    'Interés / Pasión / Vocación / Motivación', 'Conocimiento / Aprendizaje',
    'Interrelación', 'Experiencias / Vivencias sensoriales', 'Expresión creativa',
    'Ejecución de habilidades / Teórico práctico', 'Desarrollo del ser', 'Metodológico / Didáctico',
    'Entorno ambiental', 'Otra'
  ];

  reasonsToDislike = [
    'Dificultad de aprendizaje', 'Metodología / Didáctica', 'Conocimiento / Aprendizaje',
    'Ejecución de habilidades / Teórico práctico', 'Interés / Pasión / Vocación / Motivación',
    'Espacial /Infraestructura / Condiciones materiales del escenario / Contexto', 'Entorno ambiental', 'Otra'
  ];

  learningResources = [
    'Lectura', 'Ejercicios prácticos', 'Recursos didácticos', 'Técnicas digitales',
    'Acompañamiento personalizado', 'Escritura', 'Metodología / Didáctica',
    'Ejecución de habilidades / Teórico práctico', 'Interrelación / Interacción',
    'Desarrollo del ser', 'Interés / Pasión /Vocación /Motivación', 'Entorno ambiental', 'Otra'
  ];

  teachingChanges = [
    'Metodología / Intención pedagógica', 'Acompañamiento personalizado', 'Técnica',
    'Método de enseñanza', 'Intención pedagógica', 'Optimizar el tiempo de clase',
    'Educador', 'Implementar técnicas digitales', 'Forma de evaluación',
    'Fomentar la ejecución de habilidades / Teórico práctico', 'Implementar actividades extracurriculares',
    'Implementar orientación vocacional', 'Fomentar capacidades para la vida', 'Otra'
  ];

  constructor(private fb: FormBuilder) {
    this.questionsForm = this.fb.group({
      personalInfo: this.fb.group({
        fullName: ['', Validators.required],
        institution: ['', Validators.required],
        municipality: ['', Validators.required],
        educationType: ['', Validators.required],
        institutionType: ['', Validators.required],
        gradeYear: ['', Validators.required]
      }),
      favoriteSubjects: this.fb.group({
        // Se permite solo una opción
        subject: ['', Validators.required],
        reason: [''],
        otherReason: ['']
      }),
      leastFavoriteSubjects: this.fb.group({
        subject: ['', Validators.required],
        reason: [''],
        otherReason: ['']
      }),
      learningResources: this.fb.group({
        // Solo se permite seleccionar un recurso
        resource: ['', Validators.required],
        otherResource: ['']
      }),
      teachingChanges: this.fb.group({
        // Solo se permite un cambio
        change: ['', Validators.required],
        otherChange: ['']
      }),
    });
  }

  // Getters para mostrar condicionalmente el campo "Otra" si se selecciona esa opción
  get showFavoriteOtherReason() {
    return this.questionsForm.get('favoriteSubjects.reason')?.value === 'Otra';
  }
  get showLeastFavoriteOtherReason() {
    return this.questionsForm.get('leastFavoriteSubjects.reason')?.value === 'Otra';
  }
  get showLearningOtherResource() {
    return this.questionsForm.get('learningResources.resource')?.value === 'Otra';
  }
  get showTeachingOtherChange() {
    return this.questionsForm.get('teachingChanges.change')?.value === 'Otra';
  }

  submitForm() {
    if (this.questionsForm.valid) {
      console.log(this.questionsForm.value);
    } else {
      alert("Por favor, completa los campos obligatorios.");
    }
  }
}
