import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {

  options: any;
  visible: boolean = false;
  ngOnInit() {
    this.options = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      initialView: 'timeGridWeek',//日曆面板是否顯示以甚麼為單位的日期
      selectable: false, //是否可以選取多個日期
      selectOverlap: true, //日期是否可以被重複選中多次
      //eventClick: this.handleEventClick.bind(this), // 點擊每個日期要做什麼
      //select: this.handleDateSelect.bind(this), // 选中每个日期时调用的方法
      //eventsSet: this.handleEvents.bind(this), // 傳给後端進行保存
      weekends: true, //日曆面板中是否顯示周末,一開始為不顯示
      //initialDate: 2023-03-31 //畫面一開始會顯示的日期
      headerToolbar: {// 日曆表頭部分
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: false,// 是否可以進行拖拽、修改
      selectMirror: true,
      dayMaxEvents: true,
      handleWindowResize: true, //隨瀏覽器窗口大小變化
      events: [
        { title: 'event 1', date: '2023-03-31' },
        { title: 'event 2', date: '2023-03-30' },
        { title: 'event 3', date: '2023-03-29' },
        { title: 'event 4', date: '2023-03-28' },
        { title: 'event 5', date: '2023-03-29' },
        { title: 'event 6', date: '2023-03-27' },
        { title: 'event 7', date: '2023-03-26' },
        { title: 'event 8', date: '2023-03-25' },
        { title: 'event 9', date: '2023-03-24' },
      ],
      dateClick: (e: any) => {
        this.showDialog;
        console.log(e);
      }
    };
  }
  showDialog() {
    this.visible = true;
  }
}


