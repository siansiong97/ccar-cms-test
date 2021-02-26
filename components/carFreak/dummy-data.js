
import moment from 'moment';

const profilePic = "/assets/profile/profilePic.jpg";
const car1 = "/assets/profile/car1.jpeg";
const car2 = "/assets/profile/car2.jpg";
const car3 = "/assets/profile/car3.jpg";
const car4 = "/assets/profile/car4.jpg";
const car5 = "/assets/profile/car5.jpg";

export const profile = [
    {
        name: 'Harry',
        avatar: car1,
    },
    {
        name: 'Bean',
        avatar: profilePic,
    },
    {
        name: 'Maria',
        avatar: car2,
    },
    {
        name: 'Da_Hee',
        avatar: car3,
    },
    {
        name: 'John',
        avatar: car5,
    },
    {
        name: 'Simon',
        avatar: car4,
    },
    {
        name: 'Farah',
        avatar: profilePic,
    },
    {
        name: 'Jane',
        avatar: car3,
    },
    {
        name: 'Joseph',
        avatar: car1,
    },
    {
        name: 'Koichi',
        avatar: car4,
    },
    {
        name: 'Chiew Fei Fei',
        avatar: car5,
    },
    {
        name: 'Shawn',
        avatar: car2,
    },
    {
        name: 'Bella',
        avatar: profilePic,
    },
    {
        name: 'Chow',
        avatar: car3,
    },
    {
        name: 'Stella',
        avatar: car4,
    },
    {
        name: 'Kit',
        avatar: car5,
    },
    {
        name: 'Ming',
        avatar: car1,
    },
    {
        name: 'Ben',
        avatar: car2,
    },
    {
        name: 'NiNi',
        avatar: car3,
    },
    {
        name: 'Nicole',
        avatar: car4,
    },
]

export const userPosts = [
    {
        createdBy: profile[1],
        state: 'Kuala Lumpur',
        area: "Mont Kiara",
        address : 'Kiara 163',
        carspecId: {
            make : 'Volkswagen'
        },
        text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
        likes: 3456,
        images : [
            {
                name : 'test',
                url : car1,
            },
            {
                name : 'test',
                url : car2,
            },
            {
                name : 'test',
                url : car3,
            },
            {
                name : 'test',
                url : car4,
            },
            {
                name : 'test',
                url : car5,
            },
        ],
        comments: [
            {
                text: 'Awesome!!! I like It!',
                createdBy: profile[0],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '丑暴，辣眼睛',
                createdBy: profile[5],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Ok ok lo',
                createdBy: profile[1],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '关注我，谢谢大家',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                createdBy: profile[4],
                createdAt: moment().format('DD/MM/YYYY')
            },
        ],
    },
    {
        createdBy: profile[2],
        state: 'Kuala Lumpur',
        area: "Mont Kiara",
        address : 'Kiara 163',
        carspecId: {
            make : 'Volkswagen'
        },
        
        likes: 3456,
        text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
        images : [
            {
                name : 'test',
                url : car1,
            },
            {
                name : 'test',
                url : car2,
            },
            {
                name : 'test',
                url : car3,
            },
            {
                name : 'test',
                url : car4,
            },
            {
                name : 'test',
                url : car5,
            },
        ],
        comments: [
            {
                text: 'Awesome!!! I like It!',
                createdBy: profile[0],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '丑暴，辣眼睛',
                createdBy: profile[5],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Ok ok lo',
                createdBy: profile[1],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '关注我，谢谢大家',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                createdBy: profile[4],
                createdAt: moment().format('DD/MM/YYYY')
            },
        ],
    },
    {
        createdBy: profile[3],
        state: 'Kuala Lumpur',
        area: "Mont Kiara",
        address : 'Kiara 163',
        carspecId: {
            make : 'Volkswagen'
        },
        
        likes: 3456,
        text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
        images : [
            {
                name : 'test',
                url : car1,
            },
            {
                name : 'test',
                url : car2,
            },
            {
                name : 'test',
                url : car3,
            },
            {
                name : 'test',
                url : car4,
            },
            {
                name : 'test',
                url : car5,
            },
        ],
        comments: [
            {
                text: 'Awesome!!! I like It!',
                createdBy: profile[0],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '丑暴，辣眼睛',
                createdBy: profile[5],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Ok ok lo',
                createdBy: profile[1],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '关注我，谢谢大家',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                createdBy: profile[4],
                createdAt: moment().format('DD/MM/YYYY')
            },
        ],
    },
    {
        createdBy: profile[4],
        state: 'Kuala Lumpur',
        area: "Mont Kiara",
        address : 'Kiara 163',
        carspecId: {
            make : 'Volkswagen'
        },
        
        likes: 3456,
        text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
        images : [
            {
                name : 'test',
                url : car1,
            },
            {
                name : 'test',
                url : car2,
            },
            {
                name : 'test',
                url : car3,
            },
            {
                name : 'test',
                url : car4,
            },
            {
                name : 'test',
                url : car5,
            },
        ],
        comments: [
            {
                text: 'Awesome!!! I like It!',
                createdBy: profile[0],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '丑暴，辣眼睛',
                createdBy: profile[5],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Ok ok lo',
                createdBy: profile[1],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '关注我，谢谢大家',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                createdBy: profile[4],
                createdAt: moment().format('DD/MM/YYYY')
            },
        ],
    },
    {
        createdBy: profile[3],
        state: 'Kuala Lumpur',
        area: "Mont Kiara",
        address : 'Kiara 163',
        carspecId: {
            make : 'Volkswagen'
        },
        
        likes: 3456,
        text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
        images : [
            {
                name : 'test',
                url : car1,
            },
            {
                name : 'test',
                url : car2,
            },
            {
                name : 'test',
                url : car3,
            },
            {
                name : 'test',
                url : car4,
            },
            {
                name : 'test',
                url : car5,
            },
        ],
        comments: [
            {
                text: 'Awesome!!! I like It!',
                createdBy: profile[0],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '丑暴，辣眼睛',
                createdBy: profile[5],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Ok ok lo',
                createdBy: profile[1],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '关注我，谢谢大家',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                createdBy: profile[4],
                createdAt: moment().format('DD/MM/YYYY')
            },
        ],
    },
    {
        createdBy: profile[6],
        state: 'Kuala Lumpur',
        area: "Mont Kiara",
        address : 'Kiara 163',
        carspecId: {
            make : 'Volkswagen'
        },
        
        likes: 3456,
        text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
        images : [
            {
                name : 'test',
                url : car1,
            },
            {
                name : 'test',
                url : car2,
            },
            {
                name : 'test',
                url : car3,
            },
            {
                name : 'test',
                url : car4,
            },
            {
                name : 'test',
                url : car5,
            },
        ],
        comments: [
            {
                text: 'Awesome!!! I like It!',
                createdBy: profile[0],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '丑暴，辣眼睛',
                createdBy: profile[5],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Ok ok lo',
                createdBy: profile[1],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: '关注我，谢谢大家',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution',
                createdBy: profile[2],
                createdAt: moment().format('DD/MM/YYYY')
            },
            {
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                createdBy: profile[4],
                createdAt: moment().format('DD/MM/YYYY')
            },
        ],
    },
]