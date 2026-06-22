const audioHumedalTest = 'assets/audio_humedal_test.mp3';

window.CustodisData = {
  recordings: [
    {id:1,title:'Amanecer en Humedal – Traro',region:'Los Ríos',ecosystem:'Humedal',species:'Traro',date:'2026-10-12',duration:'4:30',files:15,size:'42.2MB',format:'WAV',coords:'-39.8196, -73.2452',device:'Song Meter SM4',project:'Monitoreo Humedal Carlos Anwandter',location:'Valdivia, Los Ríos',audioUrl:audioHumedalTest},
    {id:2,title:'Canto matutino – Hued-Hued',region:'Los Ríos',ecosystem:'Bosque Nativo',species:'Hued-Hued',date:'2026-09-28',duration:'3:15',files:8,size:'28.4MB',format:'WAV',coords:'-39.7500, -73.1800',device:'AudioMoth',project:'Bosque Nativo Valdiviano',location:'Valdivia, Los Ríos',audioUrl:audioHumedalTest},
    {id:3,title:'Noche en el humedal – Ranas',region:'Los Lagos',ecosystem:'Humedal',species:'Rana de Darwin',date:'2026-10-05',duration:'6:20',files:22,size:'55.1MB',format:'FLAC',coords:'-40.1200, -73.3500',device:'Song Meter SM4',project:'Anfibios del Sur',location:'Puerto Montt, Los Lagos',audioUrl:audioHumedalTest},
    {id:4,title:'Vientos costeros – Gaviotas',region:'Los Lagos',ecosystem:'Costa',species:'Gaviota dominicana',date:'2026-08-15',duration:'2:45',files:5,size:'18.7MB',format:'WAV',coords:'-41.2000, -73.0500',device:'Zoom H6',project:'Costa Patagónica',location:'Puerto Montt, Los Lagos',audioUrl:audioHumedalTest},
    {id:5,title:'Bosque lluvioso – Chucao',region:'Araucanía',ecosystem:'Bosque Nativo',species:'Chucao',date:'2026-10-01',duration:'5:10',files:12,size:'38.9MB',format:'WAV',coords:'-38.9500, -72.1200',device:'AudioMoth',project:'Bosque Nativo Valdiviano',location:'Temuco, Araucanía',audioUrl:audioHumedalTest},
    {id:6,title:'Amanecer ribereño – Traro',region:'Los Ríos',ecosystem:'Humedal',species:'Traro',date:'2026-10-10',duration:'4:00',files:10,size:'35.2MB',format:'FLAC',coords:'-39.8300, -73.2100',device:'Song Meter SM4',project:'Monitoreo Humedal Carlos Anwandter',location:'Valdivia, Los Ríos',audioUrl:audioHumedalTest},
  ],
  collections: [
    {name:'Monitoreo Humedal Carlos Anwandter',project:'Proyecto UACh 2024',files:15,img:'https://images.unsplash.com/photo-1470093851219-69951fcbb533?w=400&q=80'},
    {name:'Bosque Nativo Valdiviano',project:'Proyecto UACh 2023',files:28,img:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80'},
    {name:'Anfibios del Sur de Chile',project:'Proyecto UACh 2025',files:12,img:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'},
    {name:'Costa Patagónica',project:'Proyecto UACh 2024',files:8,img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'},
  ],
  permProjects: [
    {id:1,name:'Monitoreo Humedal Miraflores',date:'12 de Oct del 2023',files:53,level:'investigador',desc:'Los usuarios con cuenta verificada pueden descargar en WAV/FLAC.'},
    {id:2,name:'Monitoreo Humedal Miraflores',date:'12 de Oct del 2023',files:33,level:'public',desc:'Cualquier visitante puede escuchar, pero no descargar.'},
    {id:3,name:'Bosque Nativo Valdiviano',date:'05 de Sep del 2024',files:28,level:'public',desc:'Cualquier visitante puede escuchar, pero no descargar.'},
    {id:4,name:'Anfibios del Sur',date:'20 de Mar del 2025',files:12,level:'admin',desc:'Solo el administrador puede acceder y gestionar los archivos.'},
  ],
};
