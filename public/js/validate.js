$("#form-register").validate({
        rules:{
            name: "required chtname",
            password: {
                required: true,
                rangelength: [5, 12]
            },
            email: "required email"
            
        },
        messages: {
            login: {
                required: " 請輸入姓名",
            },
            password: {
                required: " 請輸入暱稱",
            },
            email: {
                required: " 請輸入信箱",
                email: " 請輸入正確格式"
            }
        }
    });
