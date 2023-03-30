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
  events: any[] = [];
  options: any;
  ngOnInit() {
    this.options = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      initialView: 'dayGridMonth',//日曆面板是否顯示以日為單位的日期
      selectable: false, //是否可以選取多個日期
      selectOverlap: true, //日期是否可以被重複選中多次
      //eventClick: this.handleEventClick.bind(this), // 點擊每個日期要做什麼
      //select: this.handleDateSelect.bind(this), // 选中每个日期时调用的方法
      //eventsSet: this.handleEvents.bind(this), // 傳给後端進行保存
      weekends: true, //日曆面板中是否顯示周末,一開始為不顯示
      //initialDate: today //畫面一開始會顯示的日期
      headerToolbar: {// 日曆表頭部分
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: false,// 是否可以進行拖拽、修改
      selectMirror: true,
      dayMaxEvents: true,
      handleWindowResize: true, //隨瀏覽器窗口大小變化
      // events: [
      //     {
      //       id: this.SalesCallRecord[0].s_id,
      //       title : this.SalesCallRecord[0].title,
      //       start: '2022-09-20',
      //   }
      //  ]
    };
}
}
