document.addEventListener('DOMContentLoaded', function() {
    loadFontAwesome();
    const RATING_THRESHOLDS = {
        GOLD: 80,
        SILVER: 71,
        BRONZE: 0
    };

    const surveyQuestions = [
        {
            category: "Thể lực (Stamina)",
            questions: [
                "Bạn có thể chơi đủ 90 phút hoặc 120 phút trong một trận bóng đá không?",
                "Bạn có thường bị chuột rút vào cuối trận không?",
                "Bạn có thể duy trì thể lực ổn định xuyên suốt trận đấu không?"
            ]
        },
        {
            category: "Tốc độ (Speed)",
            questions: [
                "Bạn có nghĩ mình là một trong những cầu thủ nhanh nhất trong đội không?",
                "Bạn có thể duy trì tốc độ cao trong suốt trận đấu không?"
            ]
        },
        {
            category: "Khả năng tăng tốc (Acceleration)",
            questions: [
                "Bạn có thể bứt tốc nhanh trong khoảng 5-10m đầu tiên không?",
                "Bạn có thể dễ dàng vượt qua hậu vệ nhờ khả năng tăng tốc không?"
            ]
        },
        {
            category: "Kiểm soát bóng (Control)",
            questions: [
                "Khi nhận bóng, bạn có thể giữ bóng tốt mà không bị mất quyền kiểm soát không?",
                "Bạn có thể khống chế bóng tốt khi bị đối phương áp sát không?"
            ]
        },
        {
            category: "Sức mạnh (Power)",
            questions: [
                "Bạn có thể đè đối phương khi tranh chấp tay đôi không?",
                "Bạn có thể đánh đầu mạnh khi tranh chấp bóng bổng không?"
            ]
        },
        {
            category: "Chuyền bóng (Passing)",
            questions: [
                "Bạn có thể thực hiện những đường chuyền chính xác ở khoảng cách xa không?",
                "Bạn có thể chuyền bóng nhanh trong phạm vi hẹp không?"
            ]
        },
        {
            category: "Sút bóng (Shooting)",
            questions: [
                "Bạn có thể sút bóng với lực mạnh và độ chính xác cao không?",
                "Bạn có thể sút bóng bằng cả hai chân không?"
            ]
        },
        {
            category: "Xoạc bóng (Tackling)",
            questions: [
                "Bạn có thường xoạc bóng chính xác mà không phạm lỗi không?",
                "Bạn có thường xuyên chiến thắng trong các pha tranh chấp tay đôi không?"
            ]
        }
    ];

    const goalkeeperQuestions = [
        {
            category: "Khả năng bắt bóng (GKH - Goalkeeper Handling)",
            questions: [
                "Bạn có thể bắt gọn bóng khi đối phương sút mạnh từ xa không?",
                "Bạn có thường xuyên để bóng bật ra khi cản phá không?",
                "Bạn có thể kiểm soát bóng tốt sau khi bắt mà không để rơi vào chân đối thủ không?"
            ]
        },
        {
            category: "Phản xạ thủ môn (GKR - Goalkeeper Reflexes)",
            questions: [
                "Bạn có thể phản xạ nhanh khi đối phương dứt điểm cận thành không?",
                "Bạn có thể bay người cản phá những cú sút hiểm hóc vào góc cao không?",
                "Bạn có thể phản ứng kịp thời khi bóng bị đổi hướng bất ngờ không?"
            ]
        }
    ];

    const options = [
        "Có",
        "Có thể", 
        "Không hẳn",
        "Không",
        "Tôi không biết"
    ];

    let playerData = {};

    const initialForm = document.getElementById('initialForm');
    const surveyForm = document.getElementById('surveyForm');
    const surveySection = document.getElementById('surveySection');
    const playerCard = document.getElementById('playerCard');

    initialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        playerData = {
            name: document.getElementById('playerName').value,
            age: document.getElementById('playerAge').value,
            height: document.getElementById('playerHeight').value,
            preferredFoot: document.getElementById('preferredFoot').value,
            position: document.getElementById('position').value
        };
        
        document.getElementById('playerForm').classList.remove('active');
        surveySection.classList.add('active');
        generateSurveyQuestions();
    });

    function generateSurveyQuestions() {
        const surveyContainer = document.querySelector('.survey-questions');
        surveyContainer.innerHTML = '';
        
        let questionsToUse = [];
        if (playerData.position === 'GK') {
            questionsToUse = [...goalkeeperQuestions];
            questionsToUse = questionsToUse.concat(
                surveyQuestions.filter(q => 
                    !q.category.includes('Stamina') && 
                    !q.category.includes('Shooting')
                )
            );
        } else {
            questionsToUse = surveyQuestions;
        }

        questionsToUse.forEach((category, categoryIndex) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('survey-category');
            categoryDiv.innerHTML = `<h3>${category.category}</h3>`;

            category.questions.forEach((question, questionIndex) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('survey-question');
                
                let optionsHTML = '';
                options.forEach((option, optionIndex) => {
                    optionsHTML += `
                        <div class="survey-option">
                            <input type="radio" 
                                   id="q${categoryIndex}_${questionIndex}_${optionIndex}"
                                   name="q${categoryIndex}_${questionIndex}"
                                   value="${optionIndex}"
                                   required>
                            <label for="q${categoryIndex}_${questionIndex}_${optionIndex}">
                                ${option}
                            </label>
                        </div>`;
                });

                questionDiv.innerHTML = `
                    <p>${question}</p>
                    <div class="survey-options">
                        ${optionsHTML}
                    </div>`;
                categoryDiv.appendChild(questionDiv);
            });
            surveyContainer.appendChild(categoryDiv);
        });
    }

    function calculateScore(response) {
        switch(response) {
            case 0: return 94; 
            case 1: return 82; 
            case 2: return 68; 
            case 3: return 55; 
            case 4: return 65; 
            default: return 50;
        }
    }

    function calculateRatings(formData) {
        const ratings = {
            stamina: 0,
            speed: 0,
            acceleration: 0,
            control: 0,
            power: 0,
            passing: 0,
            shooting: 0,
            tackling: 0,
            gkh: 0,
            gkr: 0
        };

        let categoryScores = {};
        let categoryQuestions = {};

        Array.from(surveyForm.getElementsByTagName('input')).forEach(input => {
            if (input.checked) {
                const [_, categoryIndex, questionIndex] = input.name.match(/q(\d+)_(\d+)/);
                const questions = playerData.position === 'GK' ? 
                    [...goalkeeperQuestions, ...surveyQuestions.filter(q => 
                        !q.category.includes('Stamina') && 
                        !q.category.includes('Shooting')
                    )] : 
                    surveyQuestions;
                
                const currentCategory = questions[categoryIndex].category;
                
                if (!categoryScores[currentCategory]) {
                    categoryScores[currentCategory] = 0;
                    categoryQuestions[currentCategory] = 0;
                }
                
                categoryScores[currentCategory] += calculateScore(parseInt(input.value));
                categoryQuestions[currentCategory]++;
            }
        });

        Object.keys(categoryScores).forEach(category => {
            const average = Math.round(categoryScores[category] / categoryQuestions[category]);
            
            if (category.includes('GKH')) {
                ratings.gkh = average;
            } else if (category.includes('GKR')) {
                ratings.gkr = average;
            } else if (category.includes('Stamina')) {
                ratings.stamina = average;
            } else if (category.includes('Speed')) {
                ratings.speed = average;
            } else if (category.includes('Acceleration')) {
                ratings.acceleration = average;
            } else if (category.includes('Control')) {
                ratings.control = average;
            } else if (category.includes('Power')) {
                ratings.power = average;
            } else if (category.includes('Passing')) {
                ratings.passing = average;
            } else if (category.includes('Shooting')) {
                ratings.shooting = average;
            } else if (category.includes('Tackling')) {
                ratings.tackling = average;
            }
        });

        ratings.overall = calculateOverallRating(ratings, playerData.position);

        return ratings;
    }

    function calculateOverallRating(ratings, position) {
        let overall;
        switch(position) {
            case "GK":
                overall = Math.round(
                    (ratings.gkr * 0.4 +
                     ratings.gkh * 0.4 +
                     ratings.control * 0.1 +
                     ratings.power * 0.1) 
                );
                break;

            case "DEF":
                overall = Math.round(
                    (ratings.tackling * 0.3 +
                     ratings.power * 0.2 +
                     ratings.speed * 0.15 +
                     ratings.stamina * 0.15 +
                     ratings.control * 0.2)
                );
                break;

            case "MID":
                overall = Math.round(
                    (ratings.passing * 0.3 +
                     ratings.control * 0.25 +
                     ratings.stamina * 0.15 +
                     ratings.acceleration * 0.15 +
                     ratings.shooting * 0.15)
                );
                break;

            case "FWD":
                overall = Math.round(
                    (ratings.shooting * 0.35 +
                     ratings.speed * 0.2 +
                     ratings.control * 0.2 +
                     ratings.acceleration * 0.15 +
                     ratings.power * 0.1)
                );
                break;

            default:
                overall = 70;
        }

        return Math.min(89, Math.max(55, overall));
    }

    function getFootIcon(foot) {
        const icon = '<i class="fas fa-shoe-prints"></i>';
        return `${icon} ${foot}`;
    }

    function generateComment(data) {
        const overall = data.overall;
        const position = data.position;

        if (overall >= 80) {
            if (position === 'GK') {
                return "Một thủ môn xuất sắc với phản xạ tuyệt vời! Có tiềm năng trở thành người gác đền số 1.";
            } else {
                return "Một tài năng xuất chúng! Cầu thủ này có tiềm năng trở thành ngôi sao trong tương lai.";
            }
        } else if (overall >= 71) {
            if (position === 'GK') {
                return "Thủ môn có triển vọng, cần tiếp tục rèn luyện để nâng cao phản xạ và kỹ năng bắt bóng.";
            } else {
                return "Cầu thủ có nhiều triển vọng, cần tiếp tục phát triển để đạt đến đẳng cấp cao hơn.";
            }
        } else {
            if (position === 'GK') {
                return "Cần tập trung rèn luyện thêm các kỹ năng cơ bản của một thủ môn.";
            } else {
                return "Cần nhiều nỗ lực tập luyện hơn để cải thiện các kỹ năng cơ bản.";
            }
        }
    }

    function generatePlayerCard(data) {
        const card = document.querySelector('.card');
        
        if (data.overall >= RATING_THRESHOLDS.GOLD) {
            card.className = 'card gold';
        } else if (data.overall >= RATING_THRESHOLDS.SILVER) {
            card.className = 'card silver';
        } else {
            card.className = 'card bronze';
        }

        document.querySelector('.player-name').textContent = data.name;
        document.querySelector('.player-position').innerHTML = `
            <span class="position">${data.position}</span> | 
            <span class="age">${data.age}</span> | 
            <span class="height">${data.height}cm</span> | 
            <span class="foot">${getFootIcon(data.preferredFoot)}</span>
        `;
        document.querySelector('.player-rating').textContent = data.overall;

        const statsGrid = document.querySelector('.stats-grid');
        statsGrid.innerHTML = '';
        
        const stats = [];
        if (data.position === 'GK') {
            stats.push(
                {label: 'GKR', value: Math.round(data.gkr)},
                {label: 'GKH', value: Math.round(data.gkh)},
                {label: 'SPE', value: Math.round(data.speed)},
                {label: 'ACC', value: Math.round(data.acceleration)},
                {label: 'CON', value: Math.round(data.control)},
                {label: 'POW', value: Math.round(data.power)},
                {label: 'PAS', value: Math.round(data.passing)},
                {label: 'TAC', value: Math.round(data.tackling)}
            );
        } else {
            stats.push(
                {label: 'STA', value: Math.round(data.stamina)},
                {label: 'SPE', value: Math.round(data.speed)},
                {label: 'ACC', value: Math.round(data.acceleration)},
                {label: 'CON', value: Math.round(data.control)},
                {label: 'POW', value: Math.round(data.power)},
                {label: 'PAS', value: Math.round(data.passing)},
                {label: 'SHO', value: Math.round(data.shooting)},
                {label: 'TAC', value: Math.round(data.tackling)}
            );
        }

        stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'stat-item';
            statElement.innerHTML = `
                <span class="stat-label">${stat.label}</span>
                <span class="stat-value">${stat.value}</span>
            `;
            statsGrid.appendChild(statElement);
        });

        document.querySelector('.player-comment').textContent = generateComment(data);

        const currentDate = new Date().toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        document.querySelector('.date-stamp').textContent = `Created: ${currentDate}`;
    }

    surveyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(surveyForm);
        const ratings = calculateRatings(formData);
        
        playerData = {...playerData, ...ratings};
        
        generatePlayerCard(playerData);
        surveySection.classList.remove('active');
        playerCard.classList.add('active');
    });

    document.getElementById('saveCard').addEventListener('click', async function() {
        const card = document.querySelector('.card');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        try {
            loadingOverlay.style.display = 'flex';
    
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = '-9999px';
            container.style.top = '0';
            document.body.appendChild(container);
    
            const cardClone = card.cloneNode(true);
            cardClone.style.transform = 'none';
            cardClone.style.width = '400px';
            cardClone.style.margin = '0';
            cardClone.style.position = 'static';
            container.appendChild(cardClone);
    
            const canvas = await html2canvas(cardClone, {
                scale: 4,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
                onclone: function(clonedDoc) {
                    const clonedCard = clonedDoc.querySelector('.card');
                    document.fonts.ready.then(function() {
                        const icons = clonedCard.querySelectorAll('.fas');
                        icons.forEach(icon => {
                            icon.style.display = 'inline-block';
                        });
                    });
                }
            });
    
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = imgData;
            downloadLink.download = `${playerData.name}_player_card_${new Date().toISOString().slice(0,10)}.png`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            document.body.removeChild(downloadLink);
            document.body.removeChild(container);
        } catch (error) {
            console.error('Error saving card:', error);
            alert('Có lỗi khi lưu ảnh. Vui lòng thử lại!');
        } finally {
            loadingOverlay.style.display = 'none';
        }
    });

    function loadFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(link);
    }

    document.getElementById('resetForm').addEventListener('click', function() {
        location.reload();
    });
});