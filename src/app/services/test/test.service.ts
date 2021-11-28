import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private http: HttpClient,
    private firestore : AngularFirestore
  ) { }

  getDetails(){
    return this.firestore.collection('Details', ref=> ref.orderBy("created_at", "desc")).valueChanges();
  }
  getDetailsById(id:string){
    return this.firestore.collection("Details").doc(id).valueChanges();
  }
  newDetails(id:any, item:any){
    return this.firestore.collection('Details').doc(id)
    .set(item, {merge:true});
  }

  deleteTheDetails(detailsid : string) {
   return this.firestore.collection('Details').doc(detailsid).delete()

 }
 
}
