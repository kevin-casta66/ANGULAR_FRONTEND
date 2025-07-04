import { Component, Input, OnInit, inject } from '@angular/core';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder,FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpleadoService } from '../../Services/empleado.service';
import { Router } from '@angular/router';
import { Empleado } from '../../Models/Empleado';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';



@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule, MatDatepickerModule, MatCheckboxModule, MatNativeDateModule],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css'
})
export class EmpleadoComponent implements OnInit {

  @Input('id') idEmpleado! : number;
  private empleadoServicio = inject(EmpleadoService);
  public formBuild = inject(FormBuilder);

  public formEmpleado: FormGroup = this.formBuild.group({
  nombre: ['', Validators.required],
  correo: ['', [Validators.required, Validators.email]],
  cargo: ['', Validators.required],
  departamento: [''],
  telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
  fechaContrato: ['', [Validators.required, this.fechaPasadaValidator()]], // Aquí aplicas el validador
  activo: [false]
});

fechaPasadaValidator() {
  return (control: any) => {
    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    return fechaSeleccionada <= hoy ? null : { fechaFutura: true };
  };
}

  constructor(private router:Router){}

  ngOnInit(): void {
    if(this.idEmpleado != 0){
      this.empleadoServicio.obtener(this.idEmpleado).subscribe({
        next:(data) =>{
          this.formEmpleado.patchValue({
            nombre: data.nombre,
            correo:data.correo,
            cargo:data.cargo,
            departamento:data.departamento,
            telefono:data.telefono,
            fechaContrato: this.parseFecha(data.fechaContrato),
            activo:data.activo,
          })
        },
        error:(err) =>{
          console.log(err.message)
        }
      })
    }
  }

  private parseFecha(fechaString: string): Date | null {
  if (!fechaString) return null;


  if (fechaString.includes('a. m.') || fechaString.includes('p. m.')) {
    const [datePart, timePart] = fechaString.split(' ');
    const [day, month, year] = datePart.split('/');


    const fechaISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return new Date(fechaISO);
  }


  const fecha = new Date(fechaString);
  return isNaN(fecha.getTime()) ? null : fecha;
}

  marcarControlesComoTouched() {
  Object.values(this.formEmpleado.controls).forEach(control => {
    control.markAsTouched();
  });
}

guardar(){
  if (this.formEmpleado.invalid) {
    this.marcarControlesComoTouched();
    return;
  }
  const objeto : Empleado = {
    idEmpleado : this.idEmpleado,
    nombre: this.formEmpleado.value.nombre,
    correo: this.formEmpleado.value.correo,
    cargo:this.formEmpleado.value.cargo,
    departamento:this.formEmpleado.value.departamento,
    telefono:this.formEmpleado.value.telefono,
    fechaContrato:this.formEmpleado.value.fechaContrato,
    activo:this.formEmpleado.value.activo
  }

  if(this.idEmpleado == 0){
    this.empleadoServicio.crear(objeto).subscribe({
      next:(data) =>{
        if(data.isSucess){
          this.router.navigate(["/"]);
        }else{
          alert("Error al crear")
        }
      },
      error:(err) =>{
        console.log(err.message)
      }
    })
  }else{
    this.empleadoServicio.editar(objeto).subscribe({
      next:(data) =>{
        if(data.isSucess){
          this.router.navigate(["/"]);
        }else{
          alert("Error al editar")
        }
      },
      error:(err) =>{
        console.log(err.message)
      }
    })
  }


}

volver(){
  this.router.navigate(["/"]);
}


}
