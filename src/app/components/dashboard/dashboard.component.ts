import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TestService } from 'src/app/services/test/test.service';
import firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild('takeInput') InputVar:any;
  @ViewChild('selectInput') SelectVar:any;
   name: string = "";
   email: string = "";
   company: string = "";
   position: string = "";
   upload: string = "";
   submitted = 0;
   details:any;
   update_details:any;
   id:any;
   saved=false;
   file:any;
   downloadURL!: Observable<string>;
  links:any;
  is_submitted: any;



  constructor(
    private Firestore : AngularFirestore,
    private testservice: TestService,
    private storage : AngularFireStorage,
  ) { }

  ngOnInit(){
    this.getDetails();
   
  }
  
  getDetails(){
    this.testservice.getDetails().subscribe((data:any) =>{
    this.details = data;
    })
  }
  getDetailsById(id:string){
    this.testservice.getDetailsById(id).subscribe((data:any) =>{
    this.update_details = data;
   
    })
  }
   
  createDetails(){
    const newid = this.Firestore.createId();
    const payload={
      "name" : this.name,
      "email": this.email,
      "position" : this.position,
      "company" : this.company,
      "created_at":  firebase.firestore.FieldValue.serverTimestamp(),
      "id": newid
    }
    
    this.testservice.newDetails(newid, payload).then((data:any)=>{
      this.submitted = 1;
      this.submitFile(newid);
      this.clearForm();
    })
  }
  clearForm(){
    this.name = "",
    this.email = "",
    this.company = "",
    this.InputVar.nativeElement.value = "",
    this.SelectVar.nativeElement.value=""
    
  }
  selectPosition(position: any){
    this.position = position;
  }
  deleteDetails(id: string){
    if (confirm('Delete?')) {
    this.testservice.deleteTheDetails(id);
    }
  }
  save(){
    this.testservice.newDetails(this.update_details.id, this.update_details).then(( data:any  ) => { 
      this.update_details = data;
      this.saved=true;
  })
 }
 close(){
   this.saved=false;
 }
 uploadFile(event : any){
  const file = event.target.files[0]
  this.file = file
 }
 submitFile(id:string){
   const file = this.file;
   const ref = this.storage.ref(file.name);
   const task = ref.put(file);
   task.snapshotChanges().pipe(
    finalize(() => {
      this.downloadURL = ref.getDownloadURL()
      this.downloadURL.subscribe( (url: any) => {
        console.log(url)
        var payload = {
          image_url: url
        }
        this.testservice.newDetails( id,  payload ).then (( data:any  ) => {
          this.is_submitted = 1; 
        })

      })
    })
  )
  .subscribe((link: any) =>{
    console.log(link);
  })

    

   }

}
