const mongoose = require('mongoose')
const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')
const User = require('../models/users')

const dbUrl = process.env.DB_URL

// mongoose.connect('mongodb://127.0.0.1:27017/render')
mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const cities = [
    "창원시 의창구", "창원시 마산합포구", "진주시", "통영시", "거제시",
    "사천시", "김해시", "밀양시", "양산시", "남해군", "하동군",
    "함안군", "창녕군", "고성군", "합천군", "의령군"
];

const descriptors = [
    "푸른", "맑은", "별빛", "잔잔한", "조용한", "산속의", "해변의",
    "강가의", "바람이 좋은", "자연과 함께하는", "감성적인", "평화로운",
    "힐링되는", "하늘빛", "숲속의", "달빛", "은하수", "초록빛", "아늑한"
];

const places = [
    "숲속 캠핑장", "힐링파크", "캠핑리조트", "오토캠핑장", "자연휴양림",
    "글램핑장", "카라반파크", "산책캠핑장", "별빛캠핑장", "호숫가캠핑장"
];

const descriptions = [
    "자연 속에서 편안한 휴식을 즐길 수 있는 캠핑장입니다.",
    "가족과 함께하기 좋은 아늑한 공간이에요.",
    "밤하늘의 별이 아름답게 보이는 캠핑 명소입니다.",
    "도심 근교에서 자연을 느낄 수 있는 최고의 장소입니다.",
    "맑은 공기와 푸른 숲이 어우러진 힐링 캠핑장입니다.",
    "넓은 잔디밭과 깨끗한 시설이 매력적인 곳입니다.",
    "반려동물과 함께 캠핑이 가능한 공간입니다.",
    "아이들과 함께 즐길 수 있는 체험 프로그램이 많아요.",
    "조용한 자연 속에서 여유로운 시간을 보내보세요.",
    "탁 트인 풍경과 함께하는 감성 캠핑 공간입니다."
];

const reviewContents = [
    "정말 아름다운 곳이에요!",
    "시설이 깨끗하고 관리가 잘 되어 있습니다.",
    "별이 너무 잘 보여요. 또 오고 싶어요!",
    "아이들과 함께 즐기기 좋았습니다.",
    "조용하고 분위기가 좋아요.",
    "가격대비 정말 훌륭해요!"
];

// Seed 함수
const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});

    console.log("🧹 기존 데이터 삭제 완료");

    // User 5명 생성
    const users = [];
    for (let i = 1; i <= 5; i++) {
        const user = new User({
            username: `user${i}`,
            email: `user${i}@example.com`
        });
        await user.save();
        users.push(user);
    }
    console.log("👤 유저 5명 생성 완료");

    // 캠핑장 30개 생성
    for (let i = 0; i < 30; i++) {
        const randomCity = sample(cities);
        const randomAuthor = sample(users);

        const campground = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            description: sample(descriptions),
            author: randomAuthor._id,
            location: `경상남도 ${randomCity}`,
            price: Math.floor(Math.random() * 40000) + 10000
        });

        // 리뷰 2~4개 생성 후 campground에 참조 추가
        const reviewCount = Math.floor(Math.random() * 3) + 2;
        for (let j = 0; j < reviewCount; j++) {
            const review = new Review({
                rating: Math.floor(Math.random() * 5) + 1,
                content: sample(reviewContents),
                user: sample(users)._id
            });
            await review.save();
            campground.reviews.push(review);
        }

        await campground.save();
    }

    console.log("🏕️ 캠핑장 30개 + 리뷰 생성 완료");
};

seedDB().then(() => {
    mongoose.connection.close();
    console.log("✅ MongoDB 연결 종료");
});