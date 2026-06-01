import type { Branch, Question } from '../types';

export const fixedQuestions: Question[] = [
  {
    id: 'q1_eat_or_skip',
    kind: 'fixed',
    icon: '🤔',
    text: 'Ăn hay nhịn?',
    options: [
      { id: 'eat', label: 'Ăn', icon: '😋', tags: ['eat'] },
      { id: 'skip', label: 'Nhịn', icon: '😭', tags: ['skip'] },
    ],
  },
  {
    id: 'q2_place',
    kind: 'fixed',
    icon: '📍',
    text: 'Ăn nhà hay ăn ngoài?',
    options: [
      { id: 'home', label: 'Ăn nhà', icon: '🏠', tags: ['home'] },
      { id: 'outside', label: 'Ăn ngoài', icon: '🍽️', tags: ['outside'] },
    ],
  },
  {
    id: 'q3_texture',
    kind: 'fixed',
    icon: '🍜',
    text: 'Món khô hay món nước?',
    options: [
      { id: 'dry', label: 'Món khô', icon: '🍛', tags: ['dry'] },
      { id: 'wet', label: 'Món nước', icon: '🍜', tags: ['wet'] },
    ],
  },
];

export const branchQuestionPools: Record<Branch, Question[]> = {
  home_dry: [
    {
      id: 'home_dry_rice_today',
      icon: '🍚',
      text: 'Hôm nay muốn ăn với cơm không?',
      options: [
        { id: 'yes_rice', label: 'Có', icon: '🍚', tags: ['rice', 'filling'] },
        { id: 'no_rice', label: 'Không', icon: '🥢', tags: ['snackable', 'light'] },
      ],
    },
    {
      id: 'home_dry_main_ingredient',
      icon: '🥩',
      text: 'Muốn nguyên liệu chính là gì?',
      options: [
        { id: 'meat_chicken_beef', label: 'Thịt/Gà/Bò', icon: '🥩', tags: ['meat', 'chicken', 'beef'] },
        { id: 'fish_egg_tofu', label: 'Cá/Trứng/Đậu', icon: '🐟', tags: ['seafood', 'egg_tofu'] },
      ],
    },
    {
      id: 'home_dry_cook_time',
      icon: '⏱️',
      text: 'Muốn nấu nhanh hay nấu hơi lâu?',
      options: [
        { id: 'quick', label: 'Nấu nhanh', icon: '⚡', tags: ['quick'] },
        { id: 'slow', label: 'Nấu hơi lâu', icon: '🍲', tags: ['slow', 'rich'] },
      ],
    },
    {
      id: 'home_dry_cooking_style',
      icon: '🍳',
      text: 'Thích món chiên/xào hay kho/rim?',
      options: [
        { id: 'fried_stir', label: 'Chiên/Xào', icon: '🍳', tags: ['fried', 'stir_fry', 'crispy'] },
        { id: 'braised', label: 'Kho/Rim', icon: '🥘', tags: ['braised', 'saucy', 'rich'] },
      ],
    },
    {
      id: 'home_dry_spicy',
      icon: '🌶️',
      text: 'Có ăn cay không?',
      options: [
        { id: 'spicy', label: 'Có', icon: '🌶️', tags: ['spicy'] },
        { id: 'mild', label: 'Không', icon: '🙂', tags: ['mild'] },
      ],
    },
    {
      id: 'home_dry_meat_balance',
      icon: '🥩',
      text: 'Muốn ăn nhiều thịt hay cân bằng rau thịt?',
      options: [
        { id: 'meaty', label: 'Nhiều thịt', icon: '🥩', tags: ['meaty', 'filling'] },
        { id: 'balanced', label: 'Cân bằng', icon: '🥬', tags: ['vegetable', 'balanced'] },
      ],
    },
    {
      id: 'home_dry_egg_today',
      icon: '🍳',
      text: 'Hôm nay có muốn ăn trứng không?',
      options: [
        { id: 'egg_yes', label: 'Có', icon: '🍳', tags: ['egg_tofu', 'quick'] },
        { id: 'egg_no', label: 'Không', icon: '❌', tags: ['meat', 'seafood', 'vegetable'] },
      ],
    },
    {
      id: 'home_dry_more_vegetable',
      icon: '🥗',
      text: 'Hôm nay muốn ăn nhiều rau không?',
      options: [
        { id: 'more_veg', label: 'Có', icon: '🥬', tags: ['vegetable', 'balanced', 'light'] },
        { id: 'less_veg', label: 'Không', icon: '🥩', tags: ['meaty', 'filling'] },
      ],
    },
    {
      id: 'home_dry_taste_profile',
      icon: '🍯',
      text: 'Thích vị nào hơn?',
      options: [
        { id: 'sweet_salty', label: 'Mặn ngọt', icon: '🍯', tags: ['rich', 'saucy'] },
        { id: 'spicy_salty', label: 'Cay mặn', icon: '🌶️', tags: ['spicy', 'rich'] },
      ],
    },
    {
      id: 'home_dry_sauce_level',
      icon: '🥘',
      text: 'Muốn món khô ráo hay có sốt?',
      options: [
        { id: 'dry_finish', label: 'Khô ráo', icon: '🍗', tags: ['dry_finish', 'crispy'] },
        { id: 'saucy', label: 'Có sốt', icon: '🥫', tags: ['saucy', 'rich'] },
      ],
    },
    {
      id: 'home_dry_crispy_soft',
      icon: '🍤',
      text: 'Muốn món giòn hay mềm?',
      options: [
        { id: 'crispy', label: 'Giòn', icon: '🍤', tags: ['crispy', 'fried'] },
        { id: 'soft', label: 'Mềm', icon: '🥘', tags: ['saucy', 'braised'] },
      ],
    },
    {
      id: 'home_dry_easy_bold',
      icon: '🧂',
      text: 'Thích món dễ ăn hay đậm vị?',
      options: [
        { id: 'easy', label: 'Dễ ăn', icon: '🌿', tags: ['mild', 'light'] },
        { id: 'bold', label: 'Đậm vị', icon: '🧂', tags: ['rich', 'saucy'] },
      ],
    },
    {
      id: 'home_dry_budget',
      icon: '💰',
      text: 'Hôm nay muốn tiết kiệm hay ăn thoải mái?',
      options: [
        { id: 'budget', label: 'Tiết kiệm', icon: '💸', tags: ['budget', 'quick'] },
        { id: 'comfort', label: 'Thoải mái', icon: '😋', tags: ['premium', 'rich'] },
      ],
    },
    {
      id: 'home_dry_fried_grilled',
      icon: '🔥',
      text: 'Thích món chiên/rán hay nướng?',
      options: [
        { id: 'fried', label: 'Chiên/Rán', icon: '🍤', tags: ['fried', 'crispy'] },
        { id: 'grilled', label: 'Nướng', icon: '🔥', tags: ['rich', 'meaty'] },
      ],
    },
    {
      id: 'home_dry_fullness',
      icon: '🍖',
      text: 'Muốn ăn chắc bụng hay vừa đủ?',
      options: [
        { id: 'filling', label: 'Chắc bụng', icon: '🍖', tags: ['filling', 'meaty'] },
        { id: 'enough', label: 'Vừa đủ', icon: '😊', tags: ['balanced', 'light'] },
      ],
    },
  ],
  home_wet: [
    {
      id: 'home_wet_cook_time',
      icon: '⏱️',
      text: 'Muốn làm nhanh hay nấu kỹ hơn?',
      options: [
        { id: 'quick', label: 'Làm nhanh', icon: '⚡', tags: ['quick', 'budget'] },
        { id: 'slow', label: 'Nấu kỹ hơn', icon: '🍲', tags: ['slow', 'rich'] },
      ],
    },
    {
      id: 'home_wet_spicy',
      icon: '🌶️',
      text: 'Có ăn cay không?',
      options: [
        { id: 'spicy', label: 'Có', icon: '🌶️', tags: ['spicy'] },
        { id: 'mild', label: 'Không', icon: '🙂', tags: ['mild'] },
      ],
    },
    {
      id: 'home_wet_taste',
      icon: '🍋',
      text: 'Muốn vị thanh nhẹ hay đậm đà?',
      options: [
        { id: 'light', label: 'Thanh nhẹ', icon: '🌿', tags: ['clear_broth', 'light', 'mild'] },
        { id: 'bold', label: 'Đậm đà', icon: '🧂', tags: ['rich', 'filling'] },
      ],
    },
    {
      id: 'home_wet_sour',
      icon: '🍋',
      text: 'Có muốn vị chua nhẹ không?',
      options: [
        { id: 'sour_yes', label: 'Có', icon: '🍋', tags: ['sour'] },
        { id: 'sour_no', label: 'Không', icon: '🙂', tags: ['mild', 'clear_broth'] },
      ],
    },
    {
      id: 'home_wet_fullness',
      icon: '🍚',
      text: 'Muốn nhẹ bụng hay no hơn?',
      options: [
        { id: 'light', label: 'Nhẹ bụng', icon: '🌿', tags: ['light', 'clear_broth'] },
        { id: 'filling', label: 'No hơn', icon: '🍚', tags: ['filling', 'porridge_like', 'noodle_like'] },
      ],
    },
    {
      id: 'home_wet_serving',
      icon: '👨‍👩‍👧‍👦',
      text: 'Nấu cho mình hay cho cả nhà?',
      options: [
        { id: 'solo', label: 'Một mình', icon: '🧍', tags: ['solo', 'quick'] },
        { id: 'family', label: 'Cả nhà', icon: '👨‍👩‍👧‍👦', tags: ['shared', 'slow'] },
      ],
    },
    {
      id: 'home_wet_veg_meat',
      icon: '🥬',
      text: 'Muốn thiên rau hay thiên đạm?',
      options: [
        { id: 'more_veg', label: 'Nhiều rau', icon: '🥬', tags: ['vegetable', 'light'] },
        { id: 'more_protein', label: 'Nhiều đạm', icon: '🥩', tags: ['meat', 'seafood', 'filling'] },
      ],
    },
    {
      id: 'home_wet_broth_mood',
      icon: '💧',
      text: 'Muốn nước trong hay vị dày hơn?',
      options: [
        { id: 'clear_broth', label: 'Nước trong', icon: '💧', tags: ['clear_broth', 'light'] },
        { id: 'thicker', label: 'Vị dày hơn', icon: '🥣', tags: ['rich', 'porridge_like'] },
      ],
    },
    {
      id: 'home_wet_budget',
      icon: '💰',
      text: 'Muốn tiết kiệm hay ăn thoải mái?',
      options: [
        { id: 'budget', label: 'Tiết kiệm', icon: '💸', tags: ['budget', 'quick'] },
        { id: 'comfort', label: 'Thoải mái', icon: '😋', tags: ['premium', 'rich'] },
      ],
    },
    {
      id: 'home_wet_fatigue',
      icon: '😮‍💨',
      text: 'Hôm nay muốn nấu nhẹ tay hay chịu khó hơn?',
      options: [
        { id: 'easy_mode', label: 'Nhẹ tay', icon: '😌', tags: ['quick', 'simple'] },
        { id: 'can_cook', label: 'Chịu khó hơn', icon: '🍳', tags: ['slow', 'rich'] },
      ],
    },
    {
      id: 'home_wet_comfort',
      icon: '🥣',
      text: 'Muốn kiểu dễ chịu hay chắc vị hơn?',
      options: [
        { id: 'gentle', label: 'Dễ chịu', icon: '🌿', tags: ['light', 'mild', 'clear_broth'] },
        { id: 'comforting', label: 'Chắc vị', icon: '🧂', tags: ['rich', 'filling'] },
      ],
    },
  ],
  outside_dry: [
    {
      id: 'outside_dry_rice',
      icon: '🍚',
      text: 'Muốn cơm hay không cơm?',
      options: [
        { id: 'rice', label: 'Cơm', icon: '🍚', tags: ['rice', 'filling'] },
        { id: 'no_rice', label: 'Không cơm', icon: '🥖', tags: ['no_rice', 'snackable'] },
      ],
    },
    {
      id: 'outside_dry_cuisine',
      icon: '🌍',
      text: 'Muốn món Việt hay nước ngoài?',
      options: [
        { id: 'vietnam', label: 'Việt Nam', icon: 'vietnam_flag', tags: ['vietnam'] },
        { id: 'international', label: 'Nước ngoài', icon: '🌍', tags: ['international'] },
      ],
    },
    {
      id: 'outside_dry_pace',
      icon: '⚡',
      text: 'Muốn ăn nhanh hay ngồi chill?',
      options: [
        { id: 'quick', label: 'Ăn nhanh', icon: '⚡', tags: ['quick'] },
        { id: 'chill', label: 'Ngồi chill', icon: '☕', tags: ['chill', 'premium'] },
      ],
    },
    {
      id: 'outside_dry_budget',
      icon: '💰',
      text: 'Muốn tiết kiệm hay ăn ngon hết mình?',
      options: [
        { id: 'budget', label: 'Tiết kiệm', icon: '💸', tags: ['budget'] },
        { id: 'premium', label: 'Ăn ngon', icon: '😋', tags: ['premium', 'rich'] },
      ],
    },
    {
      id: 'outside_dry_main',
      icon: '🥩',
      text: 'Muốn thịt/gà hay hải sản?',
      options: [
        { id: 'meat_chicken', label: 'Thịt/Gà', icon: '🍗', tags: ['meat', 'chicken'] },
        { id: 'seafood', label: 'Hải sản', icon: '🦐', tags: ['seafood'] },
      ],
    },
    {
      id: 'outside_dry_spicy',
      icon: '🌶️',
      text: 'Có ăn cay không?',
      options: [
        { id: 'spicy', label: 'Có', icon: '🌶️', tags: ['spicy'] },
        { id: 'mild', label: 'Không', icon: '🙂', tags: ['mild'] },
      ],
    },
    {
      id: 'outside_dry_health',
      icon: '🥗',
      text: 'Muốn healthy hay ăn bất chấp?',
      options: [
        { id: 'healthy', label: 'Healthy', icon: '🥗', tags: ['low_oil', 'light'] },
        { id: 'anything', label: 'Ăn bất chấp', icon: '🍔', tags: ['oily', 'fried', 'rich'] },
      ],
    },
    {
      id: 'outside_dry_hunger',
      icon: '🍚',
      text: 'Đói ít hay đói nhiều?',
      options: [
        { id: 'little_hungry', label: 'Đói ít', icon: '🥪', tags: ['light', 'snackable'] },
        { id: 'very_hungry', label: 'Đói nhiều', icon: '🍚', tags: ['filling', 'rice'] },
      ],
    },
    {
      id: 'outside_dry_crispy_soft',
      icon: '🍤',
      text: 'Thích giòn hay mềm?',
      options: [
        { id: 'crispy', label: 'Giòn', icon: '🍤', tags: ['crispy', 'fried'] },
        { id: 'soft', label: 'Mềm', icon: '🥘', tags: ['saucy', 'hot'] },
      ],
    },
    {
      id: 'outside_dry_hot_cool',
      icon: '🔥',
      text: 'Thích nóng hổi hay mát mẻ?',
      options: [
        { id: 'hot', label: 'Nóng', icon: '🔥', tags: ['hot'] },
        { id: 'cool', label: 'Mát', icon: '🧊', tags: ['cool', 'light'] },
      ],
    },
    {
      id: 'outside_dry_sauce',
      icon: '🥫',
      text: 'Muốn nhiều sốt hay ít sốt?',
      options: [
        { id: 'saucy', label: 'Nhiều sốt', icon: '🥫', tags: ['saucy', 'rich'] },
        { id: 'less_sauce', label: 'Ít sốt', icon: '👌', tags: ['dry_finish', 'portable'] },
      ],
    },
    {
      id: 'outside_dry_handheld_table',
      icon: '🥪',
      text: 'Muốn món cầm tay hay món ăn bàn?',
      options: [
        { id: 'handheld', label: 'Cầm tay', icon: '🥪', tags: ['portable', 'quick'] },
        { id: 'table_food', label: 'Ăn bàn', icon: '🍽️', tags: ['chill', 'filling'] },
      ],
    },
    {
      id: 'outside_dry_fried_grilled',
      icon: '🍗',
      text: 'Muốn chiên giòn hay nướng thơm?',
      options: [
        { id: 'fried', label: 'Chiên', icon: '🍤', tags: ['fried', 'crispy'] },
        { id: 'grilled', label: 'Nướng', icon: '🔥', tags: ['rich', 'meaty'] },
      ],
    },
    {
      id: 'outside_dry_creamy_clear',
      icon: '🧀',
      text: 'Thích vị béo hay vị thanh?',
      options: [
        { id: 'creamy', label: 'Béo', icon: '🧀', tags: ['creamy', 'rich'] },
        { id: 'clear', label: 'Thanh', icon: '🌿', tags: ['light', 'low_oil'] },
      ],
    },
    {
      id: 'outside_dry_meat_balance',
      icon: '🥩',
      text: 'Muốn nhiều thịt hay cân bằng hơn?',
      options: [
        { id: 'meaty', label: 'Nhiều thịt', icon: '🥩', tags: ['meaty', 'filling'] },
        { id: 'balanced', label: 'Cân bằng', icon: '🥬', tags: ['balanced', 'vegetable'] },
      ],
    },
  ],
  outside_wet: [
    {
      id: 'outside_wet_cuisine',
      icon: '🌍',
      text: 'Muốn món Việt hay nước ngoài?',
      options: [
        { id: 'vietnam', label: 'Việt Nam', icon: 'vietnam_flag', tags: ['vietnam'] },
        { id: 'international', label: 'Nước ngoài', icon: '🌍', tags: ['international'] },
      ],
    },
    {
      id: 'outside_wet_spicy',
      icon: '🌶️',
      text: 'Có ăn cay không?',
      options: [
        { id: 'spicy', label: 'Có', icon: '🌶️', tags: ['spicy'] },
        { id: 'mild', label: 'Không', icon: '🙂', tags: ['mild'] },
      ],
    },
    {
      id: 'outside_wet_serving',
      icon: '🍲',
      text: 'Muốn ăn một tô hay đi lẩu?',
      options: [
        { id: 'bowl', label: 'Một tô', icon: '🍜', tags: ['bowl', 'quick'] },
        { id: 'hotpot', label: 'Lẩu', icon: '🍲', tags: ['hotpot', 'shared', 'chill'] },
      ],
    },
    {
      id: 'outside_wet_main',
      icon: '🥩',
      text: 'Muốn thịt/gà hay hải sản?',
      options: [
        { id: 'meat_chicken', label: 'Thịt/Gà', icon: '🍗', tags: ['meat', 'chicken'] },
        { id: 'seafood', label: 'Hải sản', icon: '🦐', tags: ['seafood'] },
      ],
    },
    {
      id: 'outside_wet_health',
      icon: '🥗',
      text: 'Muốn healthy hay ăn đậm đà?',
      options: [
        { id: 'healthy', label: 'Healthy', icon: '🥗', tags: ['light', 'clear_broth', 'low_oil'] },
        { id: 'rich', label: 'Đậm đà', icon: '🍖', tags: ['rich', 'oily', 'filling'] },
      ],
    },
    {
      id: 'outside_wet_fullness',
      icon: '🍚',
      text: 'Muốn chắc bụng hay ăn nhẹ?',
      options: [
        { id: 'filling', label: 'Chắc bụng', icon: '🍚', tags: ['filling', 'noodle'] },
        { id: 'light', label: 'Ăn nhẹ', icon: '🌿', tags: ['light', 'snackable'] },
      ],
    },
    {
      id: 'outside_wet_temp',
      icon: '🔥',
      text: 'Muốn nóng hổi hay mát lạnh?',
      options: [
        { id: 'hot', label: 'Nóng', icon: '🔥', tags: ['hot'] },
        { id: 'cool', label: 'Mát', icon: '🧊', tags: ['cool', 'light'] },
      ],
    },
    {
      id: 'outside_wet_broth',
      icon: '🍜',
      text: 'Thích nước dùng trong hay béo?',
      options: [
        { id: 'clear', label: 'Trong', icon: '💧', tags: ['clear_broth', 'light'] },
        { id: 'creamy', label: 'Béo', icon: '🥛', tags: ['rich', 'creamy'] },
      ],
    },
    {
      id: 'outside_wet_noodle_size',
      icon: '🍜',
      text: 'Thích sợi nhỏ hay sợi to?',
      options: [
        { id: 'small_noodle', label: 'Sợi nhỏ', icon: '🍜', tags: ['small_noodle'] },
        { id: 'big_noodle', label: 'Sợi to', icon: '🥢', tags: ['big_noodle'] },
      ],
    },
    {
      id: 'outside_wet_sour_clear',
      icon: '🍋',
      text: 'Thích chua cay hay thanh nhẹ?',
      options: [
        { id: 'sour_spicy', label: 'Chua cay', icon: '🌶️', tags: ['sour', 'spicy', 'rich'] },
        { id: 'gentle_clear', label: 'Thanh nhẹ', icon: '🌿', tags: ['clear_broth', 'light'] },
      ],
    },
    {
      id: 'outside_wet_meat_seafood_amount',
      icon: '🥩',
      text: 'Muốn nhiều thịt hay nhiều hải sản?',
      options: [
        { id: 'more_meat', label: 'Nhiều thịt', icon: '🥩', tags: ['meat', 'beef', 'filling'] },
        { id: 'more_seafood', label: 'Nhiều hải sản', icon: '🦐', tags: ['seafood', 'premium'] },
      ],
    },
    {
      id: 'outside_wet_broth_bold_light',
      icon: '🧂',
      text: 'Thích nước dùng đậm đà hay nhẹ nhàng?',
      options: [
        { id: 'bold', label: 'Đậm đà', icon: '🧂', tags: ['rich', 'saucy'] },
        { id: 'light', label: 'Nhẹ nhàng', icon: '🌿', tags: ['light', 'mild'] },
      ],
    },
    {
      id: 'outside_wet_budget',
      icon: '💰',
      text: 'Muốn tiết kiệm hay ăn thoải mái?',
      options: [
        { id: 'budget', label: 'Tiết kiệm', icon: '💸', tags: ['budget', 'quick'] },
        { id: 'comfort', label: 'Thoải mái', icon: '😋', tags: ['premium', 'rich'] },
      ],
    },
    {
      id: 'outside_wet_noodle_meat',
      icon: '🍜',
      text: 'Thích món nhiều sợi hay nhiều thịt?',
      options: [
        { id: 'more_noodle', label: 'Nhiều sợi', icon: '🍜', tags: ['noodle', 'filling'] },
        { id: 'more_meat', label: 'Nhiều thịt', icon: '🥩', tags: ['meat', 'filling'] },
      ],
    },
    {
      id: 'outside_wet_fullness_final',
      icon: '🍖',
      text: 'Muốn ăn no lâu hay vừa đủ?',
      options: [
        { id: 'full_long', label: 'No lâu', icon: '🍚', tags: ['filling', 'noodle'] },
        { id: 'enough', label: 'Vừa đủ', icon: '😊', tags: ['balanced', 'light'] },
      ],
    },
  ],
};
