import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder,FormGroup,ReactiveFormsModule} from '@angular/forms';
import { EmpleadoService } from '../../Services/empleado.service';
import { Empleado } from '../../Models/Empleado';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MatCardModule,MatTableModule,MatIconModule,MatButtonModule, MatFormFieldModule,
    MatInputModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  private empleadoServicio=inject(EmpleadoService)
  public listaEmpleados:Empleado[]=[];
  public displayedColums:string[]=['nombre','correo','cargo','departamento','telefono','fechaContrato','activo','accion'];

  obtenerEmpleados(){
    this.empleadoServicio.lista().subscribe({
      next:(data)=>{
        if(data.length>0){
          this.listaEmpleados=data;
        }
      },
      error:(err)=>{
        console.log(err.message)
      }
    })
  }
  constructor(private router:Router){
    this.obtenerEmpleados();
  }

  nuevo(){
    this.router.navigate(['/empleado',0]);

  }
  editar(objeto:Empleado){
    this.router.navigate(['/empleado',objeto.idEmpleado])
  }

  eliminar(objeto:Empleado){
    if (confirm("Desea eliminar al empleado"+objeto.nombre)){
      this.empleadoServicio.eliminar(objeto.idEmpleado).subscribe({
         next:(data)=>{
          if(data.isSucess){
            this.obtenerEmpleados();
          }else{
            alert("No se puede eliminar")
          }
      },
      error:(err)=>{
        console.log(err.message)
      }
      })
    }
  }
}
