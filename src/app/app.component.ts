import { salarie } from './models/salarie';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from './services/data.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Calendar } from 'primeng/calendar';
import { __assign } from 'tslib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('dt') table: Table;
  @ViewChild('entryDate')
  entryDate: Calendar;
  constructor(private primengConfig: PrimeNGConfig,private DataService:DataService , private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.salriesData = [];

   }

  salarieDialog: boolean;
  salriesData: any;
    salries: salarie[];
    salarie: salarie;

    selectedSalaries: salarie[];

    submitted: boolean;
  ngOnInit(): void {
    this.getAllSalaries();
    this.primengConfig.ripple = true;
  }
 
  openNew() {
    this.salarie = {};
    this.submitted = false;
    this.salarieDialog = true;
}
  getAllSalaries() {
    this.DataService.getList().subscribe(response => {
      console.log(response);
      this.salriesData = response;
    })
  }
 
deleteSalarie(salarie: salarie) {
  this.confirmationService.confirm({
      message: 'êtes-vous sûrsde supprimer  ' + salarie.prenom + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete(salarie);
          this.salriesData = this.salriesData.filter(val => val.id !== salarie.id);
          this.salarie = {};
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Salarie supprimer', life: 3000});
      }
  });
}
hideDialog() {
  this.salarieDialog = false;
  this.submitted = false;
}
onDateSelect(value) {
  this.table.filter(this.formatDate(value), 'date', 'equals')
}
formatDate(date) {
  
  return date.getTime() ;
}
saveSalarie() {
  this.submitted = true;
debugger
let _salarie;
  if (this.salarie.prenom.trim()) {
      if (this.salarie.id) {
          //this.salarie[this.findIndexById(this.salarie.id)] = this.salarie; 

          if(this.salarie.date instanceof Date) {
         _salarie = this.salarie.date.getTime();
         this.salarie.date=_salarie;}
         this.salarie.codesalarie=null;
          this.DataService.updateSalarie(this.salarie.id,this.salarie).subscribe((response) => {
            this.salriesData = this.getAllSalaries();

          });              
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Salarie  editer', life: 3000});

      }
      else {
         // this.salarie.codesalarie = this.createId();
         let _date=this.salarie.date
         _salarie = this.salarie.date.getTime();
         this.salarie.date=_salarie;
          this.DataService.createSalarie(this.salarie).subscribe((response) => {
            this.salriesData = this.getAllSalaries();

          });
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Salarie Cree', life: 3000});
        }

        debugger
      this.salriesData = [...this.salriesData];
      this.salarieDialog = false;
      this.salarie = {};

  }
}

parseSalarie(sal:any){

let salarie:salarie;
salarie.id=sal.id;
salarie.prenom=sal.prenom;
salarie.fonction=sal.fonction
salarie.adresse=sal.adresse
salarie.anneExp=sal.anneExp
salarie.salaire=sal.salaire
salarie.date=sal.date
salarie.codesalarie=sal.codesalarie

return salarie;

}


  delete(salarie:salarie) {
    debugger
    this.DataService.deleteSalarie(salarie.id).subscribe(Response => {
    });
  }



  editSalarie(salarie: salarie) {
    this.salarie = {...salarie};
   this.salarie.date= new Date(this.salarie.date);
    this.salarieDialog = true;
}
findIndexById(id: string): number {
  let index = -1;
  for (let i = 0; i < this.salriesData.length; i++) {
      if (this.salriesData[i].id === id) {
          index = i;
          break;
      }
  }

  return index;
}

createId(): string {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( var i = 0; i < 5; i++ ) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}


}
