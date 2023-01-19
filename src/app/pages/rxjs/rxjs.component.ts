import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, retry , interval, take, map, filter, Subscription} from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnInit , OnDestroy{
  public intervalSubs : Subscription | undefined;

  constructor() {
    
    // this.returnObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //   valor => console.log('Subs', valor),
    //   error => console.warn('Error:', error),
    //   () => console.info('OBS terminado')
    // );
    this.intervalSubs = this.returnIntervalo().subscribe( console.log)
   }

  ngOnDestroy(): void {
    this.intervalSubs?.unsubscribe();
  }
  ngOnInit(): void {
  }

  returnIntervalo(): Observable<number>{
    return interval(100).
          pipe(
            map(valor =>  valor +1),
            filter(valor => (valor % 2 === 0)? true : false)
            );
  }

  returnObservable(): Observable<number>{
    let i = -1;
    const obs$ = new Observable<number>(observer =>{
      
      const intervalo = setInterval(() =>{
        i++;
        observer.next(i);

        if(i === 4){
          clearInterval(intervalo);
          observer.complete();
        }
        if(i === 2){
          
          observer.error('i valor 2 so error')
        }
      },1000)
    });
    return obs$;
  }
}
