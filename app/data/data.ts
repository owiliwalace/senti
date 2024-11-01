export interface ItemData {
    id: string;
    name: string;
    image: string;
    due:string;
  }
  
  const DATA: ItemData[] = [
    { id: '1', name: 'Item One', image: '../../../assets/main/image1.jpeg',due:'12/10/2024' },
    { id: '2', name: 'Item Two', image: '../../../assets/main/image2.jpeg', due:'12/10/2024'},
    { id: '3', name: 'Item Three', image: '../../../assets/main/image3.jpeg' , due:'12/10/2024'},
    { id: '4', name: 'Item Four', image: '../assets/main/image4.jpeg', due:'12/10/2024' },
    
    { id: '6', name: 'Item Six', image: '../assets/main/image6.jpeg' , due:'12/10/2024'},
    { id: '7', name: 'Item Seven', image: '../assets/main/image7.jpeg' , due:'12/10/2024'},
    
  ];
  
  export default DATA;
  