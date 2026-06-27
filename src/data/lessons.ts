export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  icon: string;
  theory: {
    content: string;
    keyPoints: string[];
  };
  exercises: Exercise[];
}

export const lessons: Lesson[] = [
  // --- TOÁN HỌC (6 câu) ---
  {
    id: "phan-so",
    title: "Ôn tập về Phân số",
    category: "Toán học",
    icon: "Fraction",
    theory: {
      content: "Phân số bao gồm tử số và mẫu số. Tính chất cơ bản: Khi nhân hoặc chia cả tử và mẫu với cùng một số tự nhiên khác 0, ta được phân số mới bằng phân số cũ.",
      keyPoints: [
        "Quy đồng mẫu số: Đưa các phân số về cùng mẫu để so sánh hoặc cộng trừ.",
        "Rút gọn phân số: Chia cả tử và mẫu cho ước chung lớn nhất.",
        "So sánh phân số: Cùng mẫu so tử, khác mẫu quy đồng."
      ]
    },
    exercises: [
      {
        id: "m1",
        question: "Phân số nào bằng phân số 3/4?",
        options: ["6/8", "9/10", "3/8", "4/3"],
        correctAnswer: 0,
        explanation: "3/4 = (3x2)/(4x2) = 6/8."
      },
      {
        id: "m2",
        question: "Kết quả của phép tính 1/2 + 1/4 là:",
        options: ["2/6", "3/4", "1/6", "2/4"],
        correctAnswer: 1,
        explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4."
      },
      {
        id: "m3",
        question: "Muốn quy đồng mẫu số hai phân số 2/3 và 5/6, ta chọn mẫu số chung nhỏ nhất là:",
        options: ["18", "12", "6", "9"],
        correctAnswer: 2,
        explanation: "Vì 6 chia hết cho 3 nên ta chọn 6 làm mẫu số chung."
      },
      {
        id: "m4",
        question: "Phân số 25/100 viết dưới dạng phân số tối giản là:",
        options: ["1/4", "1/2", "1/5", "2/5"],
        correctAnswer: 0,
        explanation: "Chia cả tử và mẫu cho 25 ta được 1/4."
      },
      {
        id: "m5",
        question: "So sánh 5/7 và 6/7. Khẳng định nào đúng?",
        options: ["5/7 > 6/7", "5/7 < 6/7", "5/7 = 6/7", "Không so sánh được"],
        correctAnswer: 1,
        explanation: "Trong hai phân số cùng mẫu số, phân số nào có tử số bé hơn thì bé hơn."
      },
      {
        id: "m6",
        question: "Tìm x biết x - 1/2 = 1/4:",
        options: ["1/4", "1/2", "3/4", "1"],
        correctAnswer: 2,
        explanation: "x = 1/4 + 1/2 = 1/4 + 2/4 = 3/4."
      }
    ]
  },
  // --- TIẾNG VIỆT (6 câu) ---
  {
    id: "tu-dong-nghia",
    title: "Từ đồng nghĩa",
    category: "Tiếng Việt",
    icon: "Languages",
    theory: {
      content: "Từ đồng nghĩa là những từ có nghĩa giống nhau hoặc gần giống nhau. Có hai loại: đồng nghĩa hoàn toàn và đồng nghĩa không hoàn toàn.",
      keyPoints: [
        "Ví dụ đồng nghĩa hoàn toàn: hổ, cọp, hùm.",
        "Ví dụ đồng nghĩa không hoàn toàn: ăn, xơi, chén (khác nhau về thái độ).",
        "Sử dụng từ đồng nghĩa giúp câu văn sinh động, tránh lặp từ."
      ]
    },
    exercises: [
      {
        id: "v1",
        question: "Dòng nào dưới đây gồm các từ đồng nghĩa với từ 'bao la'?",
        options: ["Rộng lớn, bát ngát, thênh thang", "Mênh mông, nhỏ bé, xa xôi", "Cao vút, sâu thẳm, rộng rãi", "To lớn, vĩ đại, gần gũi"],
        correctAnswer: 0,
        explanation: "Rộng lớn, bát ngát, thênh thang đều chỉ diện tích rất lớn, đồng nghĩa với bao la."
      },
      {
        id: "v2",
        question: "Từ nào đồng nghĩa với từ 'đoàn kết'?",
        options: ["Chia rẽ", "Gắn bó", "Đùm bọc", "Cả B và C đều đúng"],
        correctAnswer: 3,
        explanation: "Gắn bó và đùm bọc đều thể hiện sự đoàn kết, giúp đỡ lẫn nhau."
      },
      {
        id: "v3",
        question: "Từ nào dưới đây KHÔNG đồng nghĩa với các từ còn lại?",
        options: ["Gìn giữ", "Bảo vệ", "Phá hoại", "Bảo quản"],
        correctAnswer: 2,
        explanation: "Phá hoại là từ trái nghĩa với gìn giữ/bảo vệ."
      },
      {
        id: "v4",
        question: "Từ nào đồng nghĩa với từ 'hiền lành'?",
        options: ["Dữ tợn", "Hiền từ", "Ác độc", "Nhút nhát"],
        correctAnswer: 1,
        explanation: "Hiền từ có nghĩa gần giống với hiền lành."
      },
      {
        id: "v5",
        question: "Chọn từ thích hợp điền vào chỗ trống: 'Cánh đồng lúa chín vàng ...'",
        options: ["lịm", "mượt", "hươu", "ươm"],
        correctAnswer: 3,
        explanation: "Vàng ươm là từ hay dùng để chỉ màu lúa chín đẹp mắt."
      },
      {
        id: "v6",
        question: "Thành ngữ nào dưới đây chỉ sự đoàn kết?",
        options: ["Lên thác xuống ghềnh", "Kề vai sát cánh", "Chân cứng đá mềm", "Đi một ngày đàng học một sàng khôn"],
        correctAnswer: 1,
        explanation: "Kề vai sát cánh thể hiện sự đồng lòng, gắn bó cùng nhau thực hiện nhiệm vụ."
      }
    ]
  },
  // --- KHOA HỌC (6 câu) ---
  {
    id: "su-bien-doi-chat",
    title: "Sự biến đổi hóa học",
    category: "Khoa học",
    icon: "Beaker",
    theory: {
      content: "Sự biến đổi hóa học là sự biến đổi từ chất này thành chất khác. Khác với biến đổi vật lý, biến đổi hóa học tạo ra chất mới.",
      keyPoints: [
        "Sự đốt cháy là một sự biến đổi hóa học.",
        "Sắt bị gỉ là do tác động của oxy và độ ẩm trong không khí.",
        "Dấu hiệu: Có màu sắc, mùi vị mới hoặc tỏa nhiệt."
      ]
    },
    exercises: [
      {
        id: "s1",
        question: "Hiện tượng nào sau đây là sự biến đổi hóa học?",
        options: ["Xé nhỏ tờ giấy", "Đun nóng đường thành màu đen và có mùi khét", "Nước đá tan thành nước lỏng", "Thủy tinh bị vỡ"],
        correctAnswer: 1,
        explanation: "Đun đường thành màu đen tạo ra chất mới (carbon), đây là biến đổi hóa học."
      },
      {
        id: "s2",
        question: "Khi cho vôi sống vào nước, hiện tượng gì xảy ra?",
        options: ["Nước lạnh đi", "Nước nóng lên và biến thành vôi tôi", "Không có gì thay đổi", "Nước biến mất"],
        correctAnswer: 1,
        explanation: "Đây là phản ứng tỏa nhiệt mạnh, tạo ra chất mới là vôi tôi."
      },
      {
        id: "s3",
        question: "Hỗn hợp nào dưới đây là dung dịch?",
        options: ["Nước đường", "Nước phù sa", "Cát trong nước", "Dầu ăn trong nước"],
        correctAnswer: 0,
        explanation: "Dung dịch là hỗn hợp đồng nhất giữa dung môi và chất tan (đường tan đều trong nước)."
      },
      {
        id: "s4",
        question: "Vật dẫn điện tốt nhất trong các vật sau là:",
        options: ["Gỗ khô", "Cao su", "Đồng", "Nhựa"],
        correctAnswer: 2,
        explanation: "Kim loại (như đồng) là vật dẫn điện rất tốt."
      },
      {
        id: "s5",
        question: "Nguồn năng lượng nào là sạch, không gây ô nhiễm môi trường?",
        options: ["Than đá", "Dầu mỏ", "Năng lượng mặt trời", "Khí đốt"],
        correctAnswer: 2,
        explanation: "Năng lượng mặt trời là nguồn năng lượng tái tạo và không phát thải khí độc hại."
      },
      {
        id: "s6",
        question: "Sự thụ phấn xảy ra khi nào?",
        options: ["Khi hạt phấn rơi vào đầu nhụy", "Khi noãn biến thành hạt", "Khi bầu nhụy biến thành quả", "Khi cây ra hoa"],
        correctAnswer: 0,
        explanation: "Thụ phấn là quá trình hạt phấn từ nhị tiếp xúc với đầu nhụy của hoa."
      }
    ]
  },
  // --- LỊCH SỬ & ĐỊA LÝ (6 câu) ---
  {
    id: "dia-ly-viet-nam",
    title: "Vị trí địa lý nước ta",
    category: "Lịch sử & Địa lý",
    icon: "Globe",
    theory: {
      content: "Việt Nam nằm trên bán đảo Đông Dương, thuộc khu vực Đông Nam Á. Hình dáng hình chữ S, hẹp ngang và kéo dài theo chiều Bắc - Nam.",
      keyPoints: [
        "Diện tích đất liền khoảng 330.000 km2.",
        "Đường bờ biển dài 3260 km.",
        "Có 54 dân tộc anh em cùng sinh sống.",
        "Thủ đô là thành phố Hà Nội."
      ]
    },
    exercises: [
      {
        id: "g1",
        question: "Đảo lớn nhất Việt Nam là đảo nào?",
        options: ["Phú Quốc", "Cát Bà", "Côn Đảo", "Lý Sơn"],
        correctAnswer: 0,
        explanation: "Phú Quốc là hòn đảo có diện tích lớn nhất Việt Nam."
      },
      {
        id: "g2",
        question: "Nước ta có bao nhiêu dân tộc anh em?",
        options: ["50 dân tộc", "52 dân tộc", "54 dân tộc", "56 dân tộc"],
        correctAnswer: 2,
        explanation: "Việt Nam là quốc gia đa dân tộc với 54 dân tộc anh em."
      },
      {
        id: "g3",
        question: "Phần đất liền nước ta giáp với những nước nào?",
        options: ["Trung Quốc, Lào, Thái Lan", "Lào, Campuchia, Thái Lan", "Trung Quốc, Lào, Campuchia", "Trung Quốc, Campuchia, Myanmar"],
        correctAnswer: 2,
        explanation: "Các nước láng giềng giáp biên giới đất liền là Trung Quốc, Lào và Campuchia."
      },
      {
        id: "g4",
        question: "Dãy núi cao nhất nước ta là dãy núi nào?",
        options: ["Trường Sơn Bắc", "Trường Sơn Nam", "Hoàng Liên Sơn", "Dãy Đông Triều"],
        correctAnswer: 2,
        explanation: "Dãy Hoàng Liên Sơn có đỉnh Fansipan cao nhất Việt Nam và Đông Dương."
      },
      {
        id: "g5",
        question: "Phong trào Cần Vương nổ ra vào thời gian nào?",
        options: ["Cuối thế kỉ XVIII", "Cuối thế kỉ XIX", "Đầu thế kỉ XX", "Giữa thế kỉ XX"],
        correctAnswer: 1,
        explanation: "Phong trào Cần Vương do vua Hàm Nghi khởi xướng vào năm 1885 (cuối thế kỉ XIX)."
      },
      {
        id: "g6",
        question: "Phan Bội Châu là người lãnh đạo phong trào nào?",
        options: ["Phong trào Cần Vương", "Phong trào Duy Tân", "Phong trào Đông Du", "Xô Viết Nghệ Tĩnh"],
        correctAnswer: 2,
        explanation: "Phan Bội Châu là thủ lĩnh của phong trào Đông Du, đưa thanh niên sang Nhật học tập."
      }
    ]
  },
  // --- TIN HỌC (6 câu) ---
  {
    id: "soan-thao-van-ban",
    title: "Soạn thảo văn bản",
    category: "Tin học",
    icon: "Laptop",
    theory: {
      content: "Phần mềm soạn thảo văn bản giúp chúng ta tạo ra tài liệu. Kỹ năng quan trọng: định dạng và sử dụng phím tắt.",
      keyPoints: [
        "Telex là kiểu gõ phổ biến nhất.",
        "Định dạng chữ: Đậm, Nghiêng, Gạch chân.",
        "Sử dụng bảng để trình bày thông tin khoa học."
      ]
    },
    exercises: [
      {
        id: "c1",
        question: "Để lưu văn bản, ta dùng tổ hợp phím nào?",
        options: ["Ctrl + C", "Ctrl + V", "Ctrl + S", "Ctrl + N"],
        correctAnswer: 2,
        explanation: "Ctrl + S (Save) là lệnh lưu văn bản."
      },
      {
        id: "c2",
        question: "Kiểu gõ nào phổ biến nhất để gõ tiếng Việt hiện nay?",
        options: ["VNI", "Telex", "VIQR", "Tùy ý"],
        correctAnswer: 1,
        explanation: "Telex là kiểu gõ thông dụng nhất."
      },
      {
        id: "c3",
        question: "Để in văn bản, ta dùng tổ hợp phím nào?",
        options: ["Ctrl + P", "Ctrl + I", "Ctrl + B", "Ctrl + U"],
        correctAnswer: 0,
        explanation: "Ctrl + P (Print) được dùng để ra lệnh in."
      },
      {
        id: "c4",
        question: "Phím tắt nào dùng để căn lề giữa đoạn văn bản?",
        options: ["Ctrl + L", "Ctrl + R", "Ctrl + E", "Ctrl + J"],
        correctAnswer: 2,
        explanation: "Ctrl + E dùng để căn giữa (Center)."
      },
      {
        id: "c5",
        question: "Trong phần mềm Word, Microsoft PowerPoint dùng để làm gì?",
        options: ["Soạn thảo văn bản", "Lập bảng tính", "Trình chiếu", "Vẽ hình"],
        correctAnswer: 2,
        explanation: "Microsoft PowerPoint là phần mềm chuyên để thiết kế bài trình chiếu."
      },
      {
        id: "c6",
        question: "Kí hiệu nào sau đây là của trình duyệt web?",
        options: ["MS Word", "MS Excel", "Google Chrome", "MS Paint"],
        correctAnswer: 2,
        explanation: "Google Chrome là trình duyệt web phổ biến hiện nay."
      }
    ]
  },
  {
    id: "hinh-thang",
    title: "Diện tích hình thang",
    category: "Toán học",
    icon: "Calculator",
    theory: {
      content: "Diện tích hình thang bằng tổng độ dài hai đáy nhân với chiều cao (cùng một đơn vị đo) rồi chia cho 2.",
      keyPoints: [
        "Công thức: S = (a + b) x h / 2",
        "Trong đó a, b là hai đáy, h là chiều cao.",
        "Nhớ đổi về cùng đơn vị đo trước khi tính."
      ]
    },
    exercises: [
      {
        id: "m7",
        question: "Một hình thang có đáy lớn 10cm, đáy bé 6cm, chiều cao 5cm. Diện tích là:",
        options: ["40 cm2", "80 cm2", "30 cm2", "50 cm2"],
        correctAnswer: 0,
        explanation: "(10 + 6) x 5 / 2 = 16 x 5 / 2 = 40."
      }
    ]
  },
  {
    id: "hinh-tron",
    title: "Chu vi và Diện tích hình tròn",
    category: "Toán học",
    icon: "Calculator",
    theory: {
      content: "Chu vi hình tròn C = d x 3.14 hoặc C = r x 2 x 3.14. Diện tích hình tròn S = r x r x 3.14.",
      keyPoints: [
        "r là bán kính, d là đường kính.",
        "Số 3.14 là số Pi xấp xỉ.",
        "Bán kính bằng một nửa đường kính."
      ]
    },
    exercises: [
      {
        id: "m8",
        question: "Hình tròn có bán kính 2cm thì chu vi là:",
        options: ["6.28 cm", "12.56 cm", "3.14 cm", "10 cm"],
        correctAnswer: 1,
        explanation: "2 x 2 x 3.14 = 12.56."
      }
    ]
  },
  {
    id: "tu-trai-nghia",
    title: "Từ trái nghĩa",
    category: "Tiếng Việt",
    icon: "Languages",
    theory: {
      content: "Từ trái nghĩa là những từ có ý nghĩa đối lập nhau.",
      keyPoints: [
        "Cặp từ trái nghĩa: to - nhỏ, cao - thấp, sáng - tối.",
        "Giúp làm nổi bật sự vật, sự việc được miêu tả.",
        "Thường dùng trong các câu đố, tục ngữ."
      ]
    },
    exercises: [
      {
        id: "v7",
        question: "Tìm từ trái nghĩa với từ 'siêng năng':",
        options: ["Chăm chỉ", "Cần cù", "Lười biếng", "Ngoan ngoãn"],
        correctAnswer: 2,
        explanation: "Lười biếng có nghĩa đối lập hoàn toàn với siêng năng."
      }
    ]
  },
  {
    id: "moi-truong",
    title: "Môi trường và tài nguyên",
    category: "Khoa học",
    icon: "Beaker",
    theory: {
      content: "Môi trường bao gồm tất cả các thành phần tự nhiên và nhân tạo bao quanh con người.",
      keyPoints: [
        "Tài nguyên thiên nhiên: rừng, khoáng sản, nước...",
        "Ô nhiễm môi trường: do rác thải, khí thải.",
        "Cần bảo vệ môi trường để duy trì sự sống."
      ]
    },
    exercises: [
      {
        id: "s7",
        question: "Nguồn tài nguyên nào sau đây có thể bị cạn kiệt?",
        options: ["Gió", "Mặt trời", "Than đá", "Nước thủy triều"],
        correctAnswer: 2,
        explanation: "Than đá là tài nguyên không tái tạo, khai thác mãi sẽ hết."
      }
    ]
  },
  {
    id: "chien-thang-dien-bien-phu",
    title: "Chiến thắng Điện Biên Phủ",
    category: "Lịch sử & Địa lý",
    icon: "Globe",
    theory: {
      content: "Năm 1954, quân và dân ta đã làm nên chiến thắng Điện Biên Phủ 'lừng lẫy năm châu, chấn động địa cầu'.",
      keyPoints: [
        "Lãnh đạo: Đại tướng Võ Nguyên Giáp.",
        "Thời gian: 56 ngày đêm ròng rã.",
        "Kết quả: Buộc Pháp phải ký Hiệp định Giơ-ne-vơ."
      ]
    },
    exercises: [
      {
        id: "g7",
        question: "Chiến dịch Điện Biên Phủ kết thúc vào ngày tháng năm nào?",
        options: ["7/5/1954", "30/4/1975", "19/5/1890", "2/9/1945"],
        correctAnswer: 0,
        explanation: "Ngày 7 tháng 5 năm 1954 là mốc son chói lọi của lịch sử."
      }
    ]
  },
  {
    id: "ti-so-phan-tram",
    title: "Tỉ số phần trăm",
    category: "Toán học",
    icon: "Calculator",
    theory: {
      content: "Tỉ số phần trăm của hai số a và b là a/b x 100%.",
      keyPoints: [
        "Ví dụ: 1/4 = 0.25 = 25%.",
        "Dùng để so sánh các đại lượng.",
        "Thường gặp trong các bài toán về lãi suất, giảm giá."
      ]
    },
    exercises: [
      {
        id: "m9",
        question: "Lớp 5A có 40 học sinh, trong đó có 20 học sinh nữ. Tỉ số phần trăm học sinh nữ là:",
        options: ["20%", "40%", "50%", "60%"],
        correctAnswer: 2,
        explanation: "20 / 40 = 0.5 = 50%."
      }
    ]
  },
  {
    id: "dai-tu",
    title: "Đại từ",
    category: "Tiếng Việt",
    icon: "Languages",
    theory: {
      content: "Đại từ là những từ dùng để xưng hô hay để thay thế danh từ, động từ, tính từ (hoặc cụm danh từ, cụm động từ, cụm tính từ).",
      keyPoints: [
        "Đại từ xưng hô: tôi, ta, chúng tôi, mày, nó...",
        "Đại từ thay thế: vậy, thế.",
        "Giúp tránh lặp từ trong câu."
      ]
    },
    exercises: [
      {
        id: "v8",
        question: "Trong câu 'Nam đi học, nó rất chăm chỉ', từ 'nó' thay thế cho từ nào?",
        options: ["Học", "Nam", "Chăm chỉ", "Đi"],
        correctAnswer: 1,
        explanation: "'nó' là đại từ dùng để thay thế cho danh từ riêng 'Nam'."
      }
    ]
  },
  {
    id: "vung-bien-viet-nam",
    title: "Vùng biển Việt Nam",
    category: "Lịch sử & Địa lý",
    icon: "Globe",
    theory: {
      content: "Việt Nam có đường bờ biển dài 3260km, vùng biển giàu tài nguyên.",
      keyPoints: [
        "Gồm các bộ phận: nội thủy, lãnh hải, vùng tiếp giáp lãnh hải...",
        "Có hai quần đảo lớn: Hoàng Sa và Trường Sa.",
        "Biển cung cấp hải sản, dầu khí và du lịch."
      ]
    },
    exercises: [
      {
        id: "g8",
        question: "Quần đảo Trường Sa thuộc tỉnh/thành phố nào của Việt Nam?",
        options: ["Đà Nẵng", "Quảng Nam", "Khánh Hòa", "Bình Thuận"],
        correctAnswer: 2,
        explanation: "Quần đảo Trường Sa thuộc tỉnh Khánh Hòa."
      }
    ]
  },
  // --- TIẾNG ANH (6 câu) ---
  {
    id: "english-vocabulary",
    title: "English Vocabulary",
    category: "Tiếng Anh",
    icon: "Languages",
    theory: {
      content: "Học từ vựng tiếng Anh lớp 5 theo chủ đề. Tập trung vào cách phát âm và sử dụng từ trong câu.",
      keyPoints: [
        "Greeting: Hello, Hi, How are you?",
        "Daily activities: Brush teeth, Do homework, Go to school.",
        "Practice speaking and listening daily."
      ]
    },
    exercises: [
      {
        id: "e1",
        question: "What is the English word for 'Trường học'?",
        options: ["House", "Hospital", "School", "Park"],
        correctAnswer: 2,
        explanation: "School có nghĩa là trường học."
      },
      {
        id: "e2",
        question: "Choose the correct spelling:",
        options: ["Beatiful", "Beautiful", "Beautifull", "Beatifully"],
        correctAnswer: 1,
        explanation: "Beautiful (xinh đẹp) là cách viết đúng."
      },
      {
        id: "e3",
        question: "Listen and choose (Nghe và chọn): 'I like playing football.'",
        options: ["Tôi thích chơi bóng đá.", "Tôi thích chơi bóng rổ.", "Tôi thích chơi cầu lông.", "Tôi thích chơi tennis."],
        correctAnswer: 0,
        explanation: "Football nghĩa là bóng đá."
      },
      {
        id: "e10",
        question: "Ghi âm lại câu sau: 'I am a student.'",
        options: ["Xong", "Chưa xong", "Bỏ qua", "Hoàn thành"],
        correctAnswer: 0,
        explanation: "Hãy nhấn vào nút Ghi âm để thực hành phát âm."
      }
    ]
  },
  // --- BỔ SUNG THÊM BÀI HỌC MỚI ---
  {
    id: "hinh-hop-chu-nhat",
    title: "Hình hộp chữ nhật & Hình lập phương",
    category: "Toán học",
    icon: "Box",
    theory: {
      content: "Hình hộp chữ nhật có 6 mặt, 8 đỉnh và 12 cạnh. Các mặt đối diện bằng nhau. Hình lập phương là hình hộp chữ nhật đặc biệt có tất cả các cạnh bằng nhau.",
      keyPoints: [
        "S xung quanh HHCN = (a + b) x 2 x h",
        "S toàn phần HHCN = S xung quanh + S 2 đáy",
        "V HHCN = a x b x c",
        "V hình lập phương = a x a x a"
      ]
    },
    exercises: [
      {
        id: "m10",
        question: "Thể tích của hình lập phương có cạnh 3cm là:",
        options: ["9 cm3", "27 cm3", "18 cm3", "12 cm3"],
        correctAnswer: 1,
        explanation: "V = 3 x 3 x 3 = 27 cm3."
      },
      {
        id: "m11",
        question: "Hình hộp chữ nhật có bao nhiêu cạnh?",
        options: ["6 cạnh", "8 cạnh", "12 cạnh", "10 cạnh"],
        correctAnswer: 2,
        explanation: "Hình hộp chữ nhật có 12 cạnh."
      }
    ]
  },
  {
    id: "toan-chuyen-dong",
    title: "Toán về chuyển động đều",
    category: "Toán học",
    icon: "Zap",
    theory: {
      content: "Ba đại lượng quan trọng: Vận tốc (v), Quãng đường (s), Thời gian (t).",
      keyPoints: [
        "s = v x t",
        "v = s / t",
        "t = s / v",
        "Chú ý đơn vị: km/h tương ứng với km và giờ, m/ph tương ứng với m và phút."
      ]
    },
    exercises: [
      {
        id: "m12",
        question: "Một người đi xe máy trong 2 giờ với vận tốc 40km/h. Quãng đường đi được là:",
        options: ["20km", "60km", "80km", "100km"],
        correctAnswer: 2,
        explanation: "s = 40 x 2 = 80 km."
      },
      {
        id: "m13",
        question: "Vận tốc của một vận động viên chạy 100m trong 10 giây là:",
        options: ["10 m/s", "100 m/s", "1 m/s", "20 m/s"],
        correctAnswer: 0,
        explanation: "v = 100 / 10 = 10 m/s."
      }
    ]
  },
  {
    id: "cau-ghiep",
    title: "Câu ghép",
    category: "Tiếng Việt",
    icon: "Merge",
    theory: {
      content: "Câu ghép là câu do nhiều vế câu ghép lại. Mỗi vế câu ghép thường có cấu tạo giống một câu đơn (có đầy đủ chủ ngữ, vị ngữ).",
      keyPoints: [
        "Cách nối trực tiếp: Dùng dấu phẩy, dấu chấm phẩy, dấu hai chấm.",
        "Cách nối bằng từ ngữ nối: Dùng quan hệ từ hoặc cặp từ hô ứng.",
        "Ví dụ cặp quan hệ từ: Vì... nên..., Tuy... nhưng..., Chẳng những... mà còn..."
      ]
    },
    exercises: [
      {
        id: "v10",
        question: "Câu nào sau đây là câu ghép?",
        options: ["Mùa xuân đã về.", "Vì trời mưa nên đường trơn.", "Em đang học bài.", "Hoa hồng rất đẹp."],
        correctAnswer: 1,
        explanation: "Câu này có 2 vế: 'trời mưa' và 'đường trơn' nối bằng cặp 'Vì... nên...'"
      },
      {
        id: "v11",
        question: "Cặp quan hệ từ nào chỉ sự tương phản?",
        options: ["Vì... nên...", "Tuy... nhưng...", "Nếu... thì...", "Không những... mà còn..."],
        correctAnswer: 1,
        explanation: "Tuy... nhưng... dùng để chỉ hai vế có ý nghĩa trái ngược nhau."
      }
    ]
  },
  {
    id: "nang-luong-dien",
    title: "Sử dụng năng lượng điện",
    category: "Khoa học",
    icon: "Zap",
    theory: {
      content: "Điện được sử dụng để chiếu sáng, đốt nóng, chạy máy. Điện lấy từ nhà máy điện, pin, ắc quy.",
      keyPoints: [
        "Nhà máy thủy điện dùng sức nước để tạo ra điện.",
        "Nhà máy nhiệt điện dùng than, dầu, khí đốt.",
        "Phải sử dụng điện an toàn và tiết kiệm: Tắt khi không dùng, không chạm tay vào dây điện hở."
      ]
    },
    exercises: [
      {
        id: "s10",
        question: "Đồ dùng điện nào dùng để đốt nóng?",
        options: ["Quạt điện", "Bàn là", "Đèn pin", "Máy bơm"],
        correctAnswer: 1,
        explanation: "Bàn là chuyển điện năng thành nhiệt năng để đốt nóng."
      },
      {
        id: "s11",
        question: "Hành động nào sau đây gây lãng phí điện?",
        options: ["Tắt đèn khi ra khỏi phòng", "Dùng bóng đèn tiết kiệm", "Bật điều hòa khi cửa sổ đang mở", "Tận dụng ánh sáng mặt trời"],
        correctAnswer: 2,
        explanation: "Mở cửa khi dùng điều hòa làm thoát nhiệt, lãng phí rất nhiều điện."
      }
    ]
  },
  {
    id: "dia-ly-chau-a",
    title: "Châu Á",
    category: "Lịch sử & Địa lý",
    icon: "Map",
    theory: {
      content: "Châu Á là châu lục lớn nhất thế giới cả về diện tích và dân số. Việt Nam nằm ở phía Đông Nam của châu Á.",
      keyPoints: [
        "Có nhiều đới khí hậu từ hàn đới đến nhiệt đới.",
        "Dãy núi cao nhất thế giới: Himalaya.",
        "Dân cư chủ yếu thuộc chủng tộc Môn-gô-lô-it."
      ]
    },
    exercises: [
      {
        id: "g10",
        question: "Đỉnh núi nào cao nhất châu Á và thế giới?",
        options: ["Fansipan", "Phú Sĩ", "Everest", "Lăng Cô"],
        correctAnswer: 2,
        explanation: "Everest thuộc dãy Himalaya là đỉnh núi cao nhất thế giới."
      },
      {
        id: "g11",
        question: "Quốc gia nào có dân số đông nhất thế giới hiện nay (năm 2024)?",
        options: ["Trung Quốc", "Ấn Độ", "Hoa Kỳ", "Nga"],
        correctAnswer: 1,
        explanation: "Ấn Độ đã chính thức vượt qua Trung Quốc trở thành quốc gia đông dân nhất."
      }
    ]
  },
  {
    id: "english-animals",
    title: "English: Animals",
    category: "Tiếng Anh",
    icon: "Dog",
    theory: {
      content: "Learn names of animals in English. Common pets and wild animals.",
      keyPoints: [
        "Pets: Dog, Cat, Bird, Rabbit.",
        "Wild animals: Lion, Tiger, Elephant, Monkey.",
        "Farm animals: Chicken, Pig, Cow, Horse."
      ]
    },
    exercises: [
      {
        id: "e4",
        question: "Which animal is the 'King of the Jungle'?",
        options: ["Cat", "Lion", "Dog", "Pig"],
        correctAnswer: 1,
        explanation: "Lion (Sư tử) thường được gọi là chúa tể rừng xanh."
      },
      {
        id: "e5",
        question: "What is an 'Elephant'?",
        options: ["Con thỏ", "Con voi", "Con hổ", "Con ngựa"],
        correctAnswer: 1,
        explanation: "Elephant nghĩa là con voi."
      }
    ]
  },
  {
    id: "tim-kiem-thong-tin",
    title: "Tìm kiếm thông tin trên Internet",
    category: "Tin học",
    icon: "Search",
    theory: {
      content: "Internet là kho tàng tri thức khổng lồ. Sử dụng các máy tìm kiếm để tìm thấy thông tin cần thiết.",
      keyPoints: [
        "Google là máy tìm kiếm phổ biến nhất.",
        "Sử dụng từ khóa chính xác để có kết quả tốt.",
        "Cần kiểm tra độ tin cậy của thông tin trên mạng."
      ]
    },
    exercises: [
      {
        id: "c7",
        question: "Đâu là một công cụ tìm kiếm?",
        options: ["Facebook", "Google", "Calculator", "Notepad"],
        correctAnswer: 1,
        explanation: "Google Search là công cụ tìm kiếm hàng đầu."
      },
      {
        id: "c8",
        question: "Khi tìm kiếm, ta nên nhập gì vào ô tìm kiếm?",
        options: ["Cả một câu dài", "Từ khóa (Keywords)", "Tên của mình", "Địa chỉ nhà"],
        correctAnswer: 1,
        explanation: "Sử dụng từ khóa ngắn gọn, súc tích sẽ cho kết quả chính xác hơn."
      }
    ]
  },
  {
    id: "hon-so",
    title: "Hỗn số",
    category: "Toán học",
    icon: "Fraction",
    theory: {
      content: "Hỗn số gồm hai phần: phần nguyên và phần phân số (phần phân số luôn bé hơn 1).",
      keyPoints: [
        "Cách đọc: Đọc phần nguyên rồi đọc phần phân số.",
        "Chuyển hỗn số sang phân số: (Phần nguyên x Mẫu + Tử) / Mẫu.",
        "So sánh hỗn số: So sánh phần nguyên trước, nếu bằng nhau mới so phần phân số."
      ]
    },
    exercises: [
      {
        id: "m14",
        question: "Hỗn số 2 và 3/4 viết dưới dạng phân số là:",
        options: ["5/4", "11/4", "6/4", "10/4"],
        correctAnswer: 1,
        explanation: "(2 x 4 + 3) / 4 = 11/4."
      }
    ]
  },
  {
    id: "nghia-cua-tu",
    title: "Nghĩa của từ",
    category: "Tiếng Việt",
    icon: "Languages",
    theory: {
      content: "Hiểu nghĩa của từ giúp ta dùng từ chính xác và hay hơn.",
      keyPoints: [
        "Nghĩa gốc: Nghĩa chính, có từ đầu.",
        "Nghĩa chuyển: Nghĩa được tạo ra dựa trên nghĩa gốc.",
        "Ví dụ: 'Mũi' (bộ phận cơ thể - gốc) -> 'Mũi' (đất liền nhô ra biển - chuyển)."
      ]
    },
    exercises: [
      {
        id: "v12",
        question: "Trong câu 'Bé có cái mũi dọc dừa', từ 'mũi' mang nghĩa gì?",
        options: ["Nghĩa gốc", "Nghĩa chuyển", "Nghĩa bóng", "Nghĩa đen"],
        correctAnswer: 0,
        explanation: "Mũi ở đây chỉ bộ phận trên cơ thể người, là nghĩa gốc."
      }
    ]
  },
  {
    id: "tai-nan-giao-thong",
    title: "Phòng tránh tai nạn giao thông",
    category: "Khoa học",
    icon: "Shield",
    theory: {
      content: "An toàn giao thông là trách nhiệm của mọi người.",
      keyPoints: [
        "Luôn đội mũ bảo hiểm khi đi xe máy.",
        "Đi đúng làn đường, phần đường quy định.",
        "Quan sát kỹ trước khi qua đường."
      ]
    },
    exercises: [
      {
        id: "s12",
        question: "Hành động nào an toàn khi tham gia giao thông?",
        options: ["Đi hàng ngang dưới lòng đường", "Đội mũ bảo hiểm đúng quy cách", "Vượt đèn đỏ khi không có công an", "Vừa đi vừa đeo tai nghe"],
        correctAnswer: 1,
        explanation: "Đội mũ bảo hiểm bảo vệ vùng đầu nếu không may xảy ra va chạm."
      }
    ]
  },
  {
    id: "chau-au",
    title: "Châu Âu",
    category: "Lịch sử & Địa lý",
    icon: "Map",
    theory: {
      content: "Châu Âu có khí hậu ôn hòa, kinh tế phát triển.",
      keyPoints: [
        "Địa hình chủ yếu là đồng bằng.",
        "Dân cư chủ yếu là người da trắng.",
        "Nhiều quốc gia có nền công nghiệp hiện đại."
      ]
    },
    exercises: [
      {
        id: "g12",
        question: "Quốc gia nào sau đây thuộc Châu Âu?",
        options: ["Việt Nam", "Pháp", "Ai Cập", "Nhật Bản"],
        correctAnswer: 1,
        explanation: "Pháp là một quốc gia lớn nằm ở Tây Âu."
      }
    ]
  },
  {
    id: "english-family",
    title: "English: My Family",
    category: "Tiếng Anh",
    icon: "Users",
    theory: {
      content: "Learn family members names in English.",
      keyPoints: [
        "Parents: Father, Mother.",
        "Grandparents: Grandfather, Grandmother.",
        "Siblings: Brother, Sister."
      ]
    },
    exercises: [
      {
        id: "e6",
        question: "Your mother's sister is your ...",
        options: ["Uncle", "Aunt", "Cousin", "Brother"],
        correctAnswer: 1,
        explanation: "Chị/em gái của mẹ gọi là Aunt (Dì/Cô)."
      }
    ]
  },
  {
    id: "phan-mem-trinh-chieu",
    title: "Phần mềm trình chiếu",
    category: "Tin học",
    icon: "Monitor",
    theory: {
      content: "Phần mềm trình chiếu giúp tạo ra các trang chiếu sinh động.",
      keyPoints: [
        "Microsoft PowerPoint là phần mềm phổ biến.",
        "Có thể thêm âm thanh, hình ảnh, video vào trang chiếu.",
        "Sử dụng hiệu ứng chuyển trang để bài thuyết trình hấp dẫn hơn."
      ]
    },
    exercises: [
      {
        id: "c9",
        question: "Phím F5 trong PowerPoint dùng để làm gì?",
        options: ["Lưu bài", "Mở bài mới", "Bắt đầu trình chiếu", "Thoát phần mềm"],
        correctAnswer: 2,
        explanation: "F5 là phím tắt để bắt đầu trình chiếu từ trang đầu tiên."
      }
    ]
  },
  {
    id: "nam-cham",
    title: "Nam châm",
    category: "Khoa học",
    icon: "Magnet",
    theory: {
      content: "Nam châm có khả năng hút các vật bằng sắt, thép.",
      keyPoints: [
        "Nam châm có hai cực: cực Bắc (N) và cực Nam (S).",
        "Hai cực cùng tên thì đẩy nhau, khác tên thì hút nhau.",
        "Ứng dụng: La bàn, loa điện, cửa tủ lạnh."
      ]
    },
    exercises: [
      {
        id: "s13",
        question: "Nam châm KHÔNG hút vật nào sau đây?",
        options: ["Đinh sắt", "Kẹp giấy", "Thước nhôm", "Kim khâu"],
        correctAnswer: 2,
        explanation: "Nam châm chỉ hút các vật có từ tính như sắt, thép, niken... nhôm không bị nam châm hút."
      }
    ]
  },
  {
    id: "english-colors",
    title: "English: Colors",
    category: "Tiếng Anh",
    icon: "Palette",
    theory: {
      content: "Learn common colors in English.",
      keyPoints: [
        "Primary colors: Red, Blue, Yellow.",
        "Mixing: Red + Blue = Purple, Yellow + Blue = Green.",
        "Black, White, Gray, Brown."
      ]
    },
    exercises: [
      {
        id: "e7",
        question: "What color is the sky on a sunny day?",
        options: ["Green", "Blue", "Red", "Yellow"],
        correctAnswer: 1,
        explanation: "Sky (Bầu trời) có màu Blue (Xanh dương)."
      }
    ]
  },
  {
    id: "ho-chi-minh",
    title: "Chủ tịch Hồ Chí Minh",
    category: "Lịch sử & Địa lý",
    icon: "User",
    theory: {
      content: "Bác Hồ là vị lãnh tụ vĩ đại của dân tộc Việt Nam.",
      keyPoints: [
        "Bác sinh ngày 19/5/1890 tại Kim Liên, Nam Đàn, Nghệ An.",
        "Bác ra đi tìm đường cứu nước năm 1911 tại Bến Nhà Rồng.",
        "Bác đọc bản Tuyên ngôn Độc lập ngày 2/9/1945."
      ]
    },
    exercises: [
      {
        id: "g13",
        question: "Bến Nhà Rồng nằm ở thành phố nào?",
        options: ["Hà Nội", "Đà Nẵng", "TP. Hồ Chí Minh", "Huế"],
        correctAnswer: 2,
        explanation: "Bến Nhà Rồng nằm ở Quận 4, TP. Hồ Chí Minh."
      }
    ]
  },
  {
    id: "hinh-tam-giac",
    title: "Diện tích hình tam giác",
    category: "Toán học",
    icon: "Triangle",
    theory: {
      content: "Muốn tính diện tích hình tam giác ta lấy độ dài đáy nhân với chiều cao (cùng một đơn vị đo) rồi chia cho 2.",
      keyPoints: [
        "S = (a x h) / 2",
        "a là cạnh đáy, h là chiều cao tương ứng.",
        "Hình tam giác vuông có diện tích bằng tích hai cạnh góc vuông chia 2."
      ]
    },
    exercises: [
      {
        id: "m15",
        question: "Một hình tam giác có đáy 8cm, chiều cao 5cm. Diện tích là:",
        options: ["20 cm2", "40 cm2", "13 cm2", "10 cm2"],
        correctAnswer: 0,
        explanation: "S = (8 x 5) / 2 = 20."
      }
    ]
  },
  {
    id: "so-thap-phan",
    title: "Khái niệm số thập phân",
    category: "Toán học",
    icon: "Calculator",
    theory: {
      content: "Số thập phân gồm hai phần: phần nguyên và phần thập phân ngăn cách bởi dấu phẩy.",
      keyPoints: [
        "Ví dụ: 1.5, 0.25, 10.75.",
        "Biến đổi phân số thập phân (10, 100, 1000...) sang số thập phân.",
        "Hàng của số thập phân: hàng mười, hàng trăm (phần nguyên) - hàng phần mười, hàng phần trăm (phần thập phân)."
      ]
    },
    exercises: [
      {
        id: "m16",
        question: "Số 0.05 đọc là:",
        options: ["Không phẩy năm", "Không phẩy không năm", "Năm phần mười", "Không phẩy năm mươi"],
        correctAnswer: 1,
        explanation: "0.05 có hai chữ số sau dấu phẩy, đọc là không phẩy không năm."
      }
    ]
  },
  {
    id: "luat-giao-thong",
    title: "An toàn giao thông",
    category: "Khoa học",
    icon: "Shield",
    theory: {
      content: "Tuân thủ luật giao thông là bảo vệ tính mạng của bản thân và mọi người.",
      keyPoints: [
        "Đi bộ trên vỉa hè hoặc sát lề đường bên phải.",
        "Không chơi đùa, đá bóng dưới lòng đường.",
        "Đội mũ bảo hiểm khi ngồi trên xe gắn máy."
      ]
    },
    exercises: [
      {
        id: "s12",
        question: "Khi thấy đèn tín hiệu giao thông chuyển sang màu đỏ, em phải làm gì?",
        options: ["Đi tiếp thật nhanh", "Dừng lại trước vạch dừng", "Đi chậm lại", "Rẽ phải luôn"],
        correctAnswer: 1,
        explanation: "Đèn đỏ báo hiệu tất cả phương tiện phải dừng lại."
      }
    ]
  },
  {
    id: "dia-ly-chau-au",
    title: "Châu Âu",
    category: "Lịch sử & Địa lý",
    icon: "Map",
    theory: {
      content: "Châu Âu nằm ở phía Tây châu Á, ngăn cách bởi dãy núi Uran. Khí hậu chủ yếu là ôn hòa.",
      keyPoints: [
        "Dân cư chủ yếu là người da trắng.",
        "Nhiều quốc gia phát triển: Đức, Pháp, Anh...",
        "Cảnh quan nổi tiếng: Tháp Eiffel, Đấu trường La Mã."
      ]
    },
    exercises: [
      {
        id: "g12",
        question: "Đại dương nào nằm ở phía Tây châu Âu?",
        options: ["Thái Bình Dương", "Ấn Độ Dương", "Đại Tây Dương", "Bắc Băng Dương"],
        correctAnswer: 2,
        explanation: "Đại Tây Dương bao bọc phía Tây của châu Âu."
      }
    ]
  },
  {
    id: "english-colors-2",
    title: "English: Colors Advanced",
    category: "Tiếng Anh",
    icon: "Palette",
    theory: {
      content: "Learn more colors in English and their meanings.",
      keyPoints: [
        "Primary colors: Red, Blue, Yellow.",
        "Secondary colors: Green, Orange, Purple.",
        "Other colors: Pink, Black, White, Grey, Brown."
      ]
    },
    exercises: [
      {
        id: "e6_2",
        question: "What color is the 'Sky' on a sunny day?",
        options: ["Red", "Green", "Blue", "Black"],
        correctAnswer: 2,
        explanation: "Blue nghĩa là màu xanh da trời."
      }
    ]
  },
  {
    id: "cau-tuong-thuat",
    title: "Câu tường thuật",
    category: "Tiếng Việt",
    icon: "MessageSquare",
    theory: {
      content: "Câu tường thuật dùng để kể, xác nhận hoặc giới thiệu về một sự việc, hiện tượng.",
      keyPoints: [
        "Thường kết thúc bằng dấu chấm.",
        "Là kiểu câu phổ biến nhất trong giao tiếp.",
        "Ví dụ: 'Hôm nay trời rất đẹp.'"
      ]
    },
    exercises: [
      {
        id: "v13",
        question: "Câu nào là câu tường thuật?",
        options: ["Bạn đang làm gì thế?", "Ôi, đẹp quá!", "Mẹ em là giáo viên.", "Hãy đi đi!"],
        correctAnswer: 2,
        explanation: "'Mẹ em là giáo viên' là câu kể/xác nhận thông tin."
      }
    ]
  },
  {
    id: "ban-do",
    title: "Làm quen với bản đồ",
    category: "Lịch sử & Địa lý",
    icon: "Map",
    theory: {
      content: "Bản đồ là hình ảnh thu nhỏ một phần hoặc toàn bộ bề mặt Trái Đất lên mặt phẳng.",
      keyPoints: [
        "Kí hiệu bản đồ giúp giải thích các đối tượng.",
        "Tỉ lệ bản đồ cho biết mức độ thu nhỏ.",
        "Màu sắc: Xanh nước biển (biển), Xanh lá (đồng bằng), Nâu/Vàng (núi)."
      ]
    },
    exercises: [
      {
        id: "g13_2",
        question: "Trên bản đồ, màu xanh nước biển thường dùng để chỉ:",
        options: ["Rừng rậm", "Đồng bằng", "Sa mạc", "Biển và đại dương"],
        correctAnswer: 3,
        explanation: "Quy ước chung màu xanh dương là nước."
      }
    ]
  },
  {
    id: "dia-ly-chau-phi",
    title: "Châu Phi",
    category: "Lịch sử & Địa lý",
    icon: "Map",
    theory: {
      content: "Châu Phi là châu lục nóng nhất thế giới, có khí hậu khô hạn và nhiều hoang mạc.",
      keyPoints: [
        "Hoang mạc lớn nhất thế giới: Sahara.",
        "Sông dài nhất thế giới: Sông Nin.",
        "Dân cư chủ yếu là người da đen."
      ]
    },
    exercises: [
      {
        id: "g14",
        question: "Sông nào dài nhất thế giới chảy qua châu Phi?",
        options: ["Sông Mê Kông", "Sông Hồng", "Sông Nin", "Sông Amazon"],
        correctAnswer: 2,
        explanation: "Sông Nin là dòng sông biểu tượng và dài nhất thế giới."
      }
    ]
  },
  {
    id: "suc-khoe",
    title: "Phòng bệnh lây qua đường tiêu hóa",
    category: "Khoa học",
    icon: "Activity",
    theory: {
      content: "Các bệnh tiêu hóa như tiêu chảy, tả, lỵ thường lây qua thức ăn và nguồn nước không sạch.",
      keyPoints: [
        "Ăn chín, uống sôi.",
        "Rửa tay sạch trước khi ăn và sau khi đi vệ sinh.",
        "Tiêu diệt ruồi, gián và giữ vệ sinh môi trường."
      ]
    },
    exercises: [
      {
        id: "s13_2",
        question: "Việc nào sau đây giúp phòng bệnh đường tiêu hóa?",
        options: ["Ăn rau sống chưa rửa", "Uống nước lã", "Rửa tay bằng xà phòng", "Ăn quà vặt vỉa hè không che đậy"],
        correctAnswer: 2,
        explanation: "Vệ sinh tay là cách đơn giản và hiệu quả nhất."
      }
    ]
  },
  {
    id: "so-sanh-so-thap-phan",
    title: "So sánh hai số thập phân",
    category: "Toán học",
    icon: "Calculator",
    theory: {
      content: "Để so sánh hai số thập phân, ta so sánh phần nguyên trước. Nếu bằng nhau mới so sánh đến phần thập phân.",
      keyPoints: [
        "So phần nguyên: Số nào có phần nguyên lớn hơn thì lớn hơn.",
        "So phần thập phân: So từng hàng (phần mười, phần trăm...) từ trái sang phải.",
        "0.5 > 0.45 (vì 5 phần mười > 4 phần mười)."
      ]
    },
    exercises: [
      {
        id: "m17",
        question: "So sánh 1.25 và 1.3. Khẳng định nào đúng?",
        options: ["1.25 > 1.3", "1.25 < 1.3", "1.25 = 1.3", "Không so sánh được"],
        correctAnswer: 1,
        explanation: "Phần nguyên bằng nhau (1). Hàng phần mười: 2 < 3 nên 1.25 < 1.3."
      }
    ]
  },
  {
    id: "nhan-so-thap-phan",
    title: "Nhân số thập phân với 10, 100, 1000",
    category: "Toán học",
    icon: "Calculator",
    theory: {
      content: "Muốn nhân một số thập phân với 10, 100, 1000... ta chỉ việc chuyển dấu phẩy sang bên phải một, hai, ba... chữ số.",
      keyPoints: [
        "Ví dụ: 1.25 x 10 = 12.5",
        "Ví dụ: 1.25 x 100 = 125",
        "Ví dụ: 0.5 x 10 = 5"
      ]
    },
    exercises: [
      {
        id: "m18",
        question: "Kết quả của 0.456 x 100 là:",
        options: ["4.56", "45.6", "456", "0.00456"],
        correctAnswer: 1,
        explanation: "Chuyển dấu phẩy sang phải 2 chữ số."
      }
    ]
  },
  {
    id: "quan-he-tu",
    title: "Quan hệ từ",
    category: "Tiếng Việt",
    icon: "Link",
    theory: {
      content: "Quan hệ từ dùng để nối các từ ngữ hoặc các câu, nhằm thể hiện mối quan hệ giữa chúng.",
      keyPoints: [
        "Các từ: và, với, hay, hoặc, nhưng, mà, bằng, của, ở, tại, nhờ...",
        "Giúp câu văn rõ nghĩa và logic hơn.",
        "Ví dụ: 'Sách CỦA em', 'Chăm chỉ NHƯNG chưa giỏi'."
      ]
    },
    exercises: [
      {
        id: "v14",
        question: "Xác định quan hệ từ trong câu: 'Hôm nay con đi học bằng xe đạp.'",
        options: ["Hôm nay", "Đi", "Bằng", "Xe đạp"],
        correctAnswer: 2,
        explanation: "'Bằng' nối hành động đi học với phương tiện xe đạp."
      }
    ]
  },
  {
    id: "english-numbers",
    title: "English: Numbers 1-100",
    category: "Tiếng Anh",
    icon: "Hash",
    theory: {
      content: "Learn to count from 1 to 100 in English.",
      keyPoints: [
        "1-10: One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten.",
        "Teens: Eleven, Twelve, Thirteen...",
        "Tens: Twenty, Thirty, Forty, Fifty, Sixty, Seventy, Eighty, Ninety, One Hundred."
      ]
    },
    exercises: [
      {
        id: "e7_2",
        question: "What is 'Twenty-five' in numbers?",
        options: ["20", "25", "52", "15"],
        correctAnswer: 1,
        explanation: "Twenty is 20, Five is 5. So 25."
      }
    ]
  },
  {
    id: "ve-hinh-trong-may-tinh",
    title: "Luyện tập vẽ hình (MS Paint)",
    category: "Tin học",
    icon: "PenTool",
    theory: {
      content: "Sử dụng các công cụ vẽ cơ bản để tạo ra những bức tranh sinh động trên máy tính.",
      keyPoints: [
        "Toolbox: Bút chì, tẩy, cọ vẽ, đổ màu.",
        "Shapes: Hình tròn, hình vuông, đường thẳng.",
        "Color picker: Chọn màu sắc từ bảng màu."
      ]
    },
    exercises: [
      {
        id: "c9",
        question: "Để đổ màu cho một vùng kín, ta dùng công cụ nào?",
        options: ["Bút chì", "Cọ vẽ", "Thùng sơn (Fill with color)", "Tẩy"],
        correctAnswer: 2,
        explanation: "Biểu tượng thùng sơn dùng để đổ màu đều cho một vùng."
      }
    ]
  },
  {
    id: "nang-luong-gio",
    title: "Năng lượng gió và nước chảy",
    category: "Khoa học",
    icon: "Wind",
    theory: {
      content: "Con người sử dụng sức gió và sức nước từ lâu đời để phục vụ đời sống.",
      keyPoints: [
        "Sức gió: Chạy thuyền buồm, làm quay tuabin phát điện.",
        "Sức nước: Quay bánh xe nước, chạy máy phát điện (thủy điện).",
        "Đây là các nguồn năng lượng tái tạo, bảo vệ môi trường."
      ]
    },
    exercises: [
      {
        id: "s14",
        question: "Thiết bị nào sau đây sử dụng năng lượng gió để tạo ra điện?",
        options: ["Tên lửa", "Cối xay gió / Tuabin gió", "Pin mặt trời", "Đèn dầu"],
        correctAnswer: 1,
        explanation: "Tuabin gió chuyển động năng của gió thành điện năng."
      }
    ]
  },
  {
    id: "dia-ly-chau-my",
    title: "Châu Mỹ",
    category: "Lịch sử & Địa lý",
    icon: "Map",
    theory: {
      content: "Châu Mỹ bao gồm Bắc Mỹ, Trung Mỹ và Nam Mỹ. Đây là châu lục có thiên nhiên đa dạng và kỳ vĩ.",
      keyPoints: [
        "Hệ thống núi hùng vĩ: Coóc-đi-e và An-đét.",
        "Rừng rậm lớn nhất thế giới: Amazon.",
        "Hoa Kỳ là quốc gia có nền kinh tế phát triển nhất."
      ]
    },
    exercises: [
      {
        id: "g15",
        question: "Rừng Amazon nằm ở châu lục nào?",
        options: ["Châu Á", "Châu Âu", "Châu Mỹ (Nam Mỹ)", "Châu Phi"],
        correctAnswer: 2,
        explanation: "Phần lớn rừng Amazon nằm ở lãnh thổ Brazil thuộc Nam Mỹ."
      }
    ]
  },
  {
    id: "luat-bao-ve-tre-em",
    title: "Quyền và bổn phận của trẻ em",
    category: "Khoa học",
    icon: "Heart",
    theory: {
      content: "Trẻ em có quyền được bảo vệ, chăm sóc và giáo dục.",
      keyPoints: [
        "Quyền được sống, quyền được học tập và vui chơi.",
        "Bổn phận: Hiếu thảo với cha mẹ, chăm chỉ học tập.",
        "Phải biết tự bảo vệ mình khỏi các hành vi xâm hại."
      ]
    },
    exercises: [
      {
        id: "s15_2",
        question: "Bổn phận chính của học sinh hiện nay là gì?",
        options: ["Đi làm kiếm tiền", "Học tập và tu dưỡng đạo đức", "Đi chơi suốt ngày", "Làm việc nặng nhọc"],
        correctAnswer: 1,
        explanation: "Học tập là nhiệm vụ quan trọng nhất của trẻ em ở độ tuổi đến trường."
      }
    ]
  },
  {
    id: "ti-le-ban-do",
    title: "Tính khoảng cách dựa trên tỉ lệ bản đồ",
    category: "Toán học",
    icon: "Map",
    theory: {
      content: "Tỉ lệ bản đồ 1:100.000 nghĩa là 1cm trên bản đồ tương ứng with 100.000cm (1km) trên thực tế.",
      keyPoints: [
        "Khoảng cách thực tế = Khoảng cách trên bản đồ x Mẫu số tỉ lệ.",
        "Chú ý đổi đơn vị đo (cm sang m hoặc km).",
        "Dùng thước kẻ đo chính xác trên bản đồ."
      ]
    },
    exercises: [
      {
        id: "m19",
        question: "Tỉ lệ 1:10.000. Nếu trên bản đồ là 2cm thì thực tế là bao nhiêu mét?",
        options: ["20m", "200m", "2000m", "2m"],
        correctAnswer: 1,
        explanation: "2 x 10.000 = 20.000cm = 200m."
      }
    ]
  },
  {
    id: "english-family",
    title: "English: Family Members",
    category: "Tiếng Anh",
    icon: "Users",
    theory: {
      content: "Learn to name family members in English.",
      keyPoints: [
        "Parents: Father (Dad), Mother (Mom).",
        "Siblings: Brother, Sister.",
        "Grandparents: Grandfather (Grandpa), Grandmother (Grandma).",
        "Others: Uncle, Aunt, Cousin."
      ]
    },
    exercises: [
      {
        id: "e8_2",
        question: "Who is your father's brother?",
        options: ["Grandpa", "Aunt", "Uncle", "Brother"],
        correctAnswer: 2,
        explanation: "Anh/em trai của bố được gọi là Uncle (Chú/Bác)."
      }
    ]
  },
  {
    id: "trinh-chieu-powerpoint",
    title: "Làm quen với PowerPoint",
    category: "Tin học",
    icon: "Monitor",
    theory: {
      content: "Phần mềm giúp tạo ra các trang trình chiếu đẹp mắt để thuyết trình.",
      keyPoints: [
        "Slide: Các trang nội dung.",
        "Transition: Hiệu ứng chuyển động giữa các trang.",
        "Animation: Hiệu ứng cho từng hình ảnh, chữ cái."
      ]
    },
    exercises: [
      {
        id: "c10_2",
        question: "Phím nào dùng để bắt đầu trình chiếu (Slide Show)?",
        options: ["F1", "F5", "Esc", "Enter"],
        correctAnswer: 1,
        explanation: "Nhấn F5 để bắt đầu buổi thuyết trình từ slide đầu tiên."
      }
    ]
  },
  {
    id: "viet-nam-cuoi-the-ky-19",
    title: "Việt Nam cuối thế kỉ XIX",
    category: "Lịch sử & Địa lý",
    icon: "Book",
    theory: {
      content: "Thời kỳ triều đình nhà Nguyễn suy yếu và thực dân Pháp bắt đầu xâm lược nước ta.",
      keyPoints: [
        "Năm 1858: Pháp nổ súng tấn công Đà Nẵng.",
        "Nhiều cuộc khởi nghĩa nổ ra: Trương Định, Nguyễn Trung Trực.",
        "Đất nước rơi vào cảnh lầm than dưới ách đô hộ."
      ]
    },
    exercises: [
      {
        id: "g16",
        question: "Thực dân Pháp bắt đầu xâm lược nước ta tại đâu?",
        options: ["Hà Nội", "Sài Gòn", "Đà Nẵng", "Huế"],
        correctAnswer: 2,
        explanation: "Ngày 1/9/1858, Pháp tấn công vào bán đảo Sơn Trà, Đà Nẵng."
      }
    ]
  }
];

export const getRandomQuiz = (): Lesson => {
  const allExercises = lessons.flatMap(l => l.exercises);
  const shuffled = [...allExercises].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 30);

  return {
    id: "kiem-tra-tong-hop",
    title: "Kiểm tra Tổng hợp",
    category: "Thử thách",
    icon: "Trophy",
    theory: {
      content: "Bài kiểm tra này bao gồm 30 câu hỏi ngẫu nhiên từ tất cả các môn học: Toán, Tiếng Việt, Khoa học, Lịch sử, Địa lý và Tin học.",
      keyPoints: [
        "Mỗi câu hỏi có 60 giây để suy nghĩ.",
        "Đây là cơ hội để bạn ôn tập lại toàn bộ kiến thức.",
        "Hãy tập trung cao độ để đạt điểm số tối đa!"
      ]
    },
    exercises: selected
  };
};
