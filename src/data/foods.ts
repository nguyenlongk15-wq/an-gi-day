import type { Branch, Food } from '../types';
import { uniqueStrings } from '../utils/random';

const foodNamesByBranch: Record<Branch, string[]> = {
  home_dry: [
    'Thịt kho trứng',
    'Thịt kho tàu',
    'Thịt kho tiêu',
    'Thịt kho gừng',
    'Thịt rang cháy cạnh',
    'Thịt rim tỏi',
    'Ba chỉ rim mắm',
    'Ba chỉ rang sả ớt',
    'Sườn rim mặn ngọt',
    'Sườn xào chua ngọt',
    'Sườn nướng',
    'Gà chiên nước mắm',
    'Gà rang gừng',
    'Gà kho sả',
    'Gà kho nghệ',
    'Gà nướng mật ong',
    'Gà hấp hành',
    'Bò xào hành tây',
    'Bò xào rau cải',
    'Bò lúc lắc',
    'Bò kho khô',
    'Bò né homemade',
    'Cá kho tộ',
    'Cá kho tiêu',
    'Cá basa kho',
    'Cá thu sốt cà',
    'Cá nục kho',
    'Cá sốt cà',
    'Cá chiên nước mắm',
    'Cá rim tiêu',
    'Tôm rim thịt',
    'Tôm rim nước dừa',
    'Tôm rang muối',
    'Tôm sốt bơ tỏi',
    'Mực chiên nước mắm',
    'Mực xào sa tế',
    'Mực xào cần tây',
    'Trứng chiên',
    'Trứng sốt cà',
    'Trứng hấp thịt bằm',
    'Trứng cuộn',
    'Trứng lòng đào',
    'Đậu hũ sốt cà',
    'Đậu hũ chiên sả',
    'Đậu hũ nhồi thịt',
    'Đậu hũ hấp',
    'Đậu hũ kho',
    'Rau muống xào tỏi',
    'Cải xào bò',
    'Cải thìa xào',
    'Bắp cải xào trứng',
    'Khổ qua xào trứng',
    'Đậu que xào tỏi',
    'Su su xào',
    'Nấm xào',
    'Rau củ luộc kho quẹt',
    'Cơm chiên trứng',
    'Cơm chiên cá mặn',
    'Cơm chiên Dương Châu',
    'Cơm chiên hải sản',
    'Cơm chiên kim chi',
    'Cơm trộn homemade',
    'Thịt luộc mắm nêm',
    'Ba chỉ cháy cạnh',
    'Bò xào sa tế',
    'Bò cuộn nấm',
    'Tôm chiên xù',
    'Cá chiên giòn',
    'Mực chiên giòn',
    'Gà chiên giòn',
    'Đậu hũ chiên giòn',
    'Cà tím nướng mỡ hành',
    'Bắp xào',
    'Kho quẹt',
    'Trứng ngâm tương',
    'Bò áp chảo',
    'Gà áp chảo',
    'Cá hồi áp chảo',
    'Tôm hấp sả',
  ],
  home_wet: [
    'Canh cải thịt bằm',
    'Canh rau ngót thịt bằm',
    'Canh bí đỏ',
    'Canh bí xanh',
    'Canh khổ qua nhồi thịt',
    'Canh chua cá',
    'Canh cà chua trứng',
    'Canh đậu hũ hẹ',
    'Canh mồng tơi',
    'Canh bầu nấu tôm',
    'Canh khoai tây cà rốt',
    'Canh cải chua',
    'Canh bí nấu xương',
    'Canh rong biển thịt bò',
    'Canh cua rau đay',
    'Canh chua tôm',
    'Canh hẹ đậu hũ',
    'Canh cải nấu thịt',
    'Canh xương hầm',
    'Canh nấm',
    'Cháo gà',
    'Cháo thịt bằm',
    'Cháo cá',
    'Cháo trứng',
    'Cháo tôm',
    'Cháo lòng',
    'Cháo vịt',
    'Cháo nghêu',
    'Cháo bò',
    'Mì trứng',
    'Mì thịt bằm',
    'Mì bò',
    'Mì hoành thánh',
    'Mì gà',
    'Mì cay homemade',
    'Bún thịt bằm',
    'Bún mọc đơn giản',
    'Bún cá',
    'Bún mọc',
    'Bún măng vịt',
    'Bún gà',
    'Bún riêu homemade',
    'Hủ tiếu thịt bằm',
    'Hủ tiếu xương',
    'Hủ tiếu hải sản',
    'Nui nấu bò',
    'Nui thịt bằm',
    'Nui gà',
    'Miến gà',
    'Miến thịt bằm',
    'Miến hải sản',
    'Miến vịt',
    'Lẩu gà',
    'Lẩu bò',
    'Lẩu hải sản',
    'Lẩu cá',
    'Lẩu Thái tại nhà',
    'Lẩu nấm',
    'Lẩu riêu cua',
    'Lẩu kim chi homemade',
    'Canh kim chi',
    'Canh bò viên',
    'Canh tôm nấu chua',
    'Canh nghêu',
    'Súp gà',
    'Súp cua',
    'Súp bí đỏ',
  ],
  outside_dry: [
    'Cơm tấm',
    'Cơm tấm sườn bì chả',
    'Cơm gà xối mỡ',
    'Cơm gà nướng',
    'Cơm chiên Dương Châu',
    'Cơm chiên hải sản',
    'Cơm bò lúc lắc',
    'Cơm sườn ram',
    'Cơm văn phòng',
    'Cơm niêu',
    'Cơm cháy gà quay',
    'Cơm heo quay',
    'Cơm cá kho',
    'Cơm cà ri Nhật',
    'Cơm trộn Hàn Quốc',
    'Bún thịt nướng',
    'Bún nem nướng',
    'Bún đậu mắm tôm',
    'Bánh mì thịt',
    'Bánh mì gà',
    'Bánh mì chảo',
    'Bánh mì xíu mại',
    'Bánh mì bò kho',
    'Bánh tráng nướng',
    'Bánh tráng trộn',
    'Bánh cuốn',
    'Bánh xèo',
    'Gỏi cuốn',
    'Gỏi gà',
    'Salad bò',
    'Bò né',
    'Steak',
    'Chicken steak',
    'Beef steak',
    'Mì xào bò',
    'Mì xào hải sản',
    'Hủ tiếu xào',
    'Yakisoba',
    'Pizza',
    'Pizza hải sản',
    'Pizza phô mai',
    'Burger bò',
    'Burger gà',
    'Burger double beef',
    'Hotdog',
    'Hotdog phô mai',
    'Pasta bò bằm',
    'Mỳ Ý carbonara',
    'Mỳ Ý hải sản',
    'Sushi',
    'Kimbap',
    'Tokbokki khô',
    'Takoyaki',
    'Okonomiyaki',
    'Kebab',
    'Taco',
    'Katsu curry',
    'Tonkatsu',
    'Dimsum',
    'Há cảo',
    'Sủi cảo chiên',
    'Nem nướng Nha Trang',
    'Xôi gà',
    'Xôi mặn',
    'Gà rán',
    'Gà rán cay',
    'Cánh gà sốt',
    'Khoai tây chiên',
    'Cá viên chiên',
    'Bò viên chiên',
    'Xiên que',
    'Lẩu nướng khô',
    'Cơm cuộn cá ngừ',
    'Cơm cuộn bò',
    'Sushi cá hồi',
    'Sushi tôm',
  ],
  outside_wet: [
    'Phở bò',
    'Phở bò đặc biệt',
    'Phở gà',
    'Phở tái',
    'Phở sốt vang',
    'Phở cuốn',
    'Bún bò Huế',
    'Bún riêu',
    'Bún mắm',
    'Bún mọc',
    'Bún cá',
    'Bún chả Hà Nội',
    'Bún thái',
    'Bún hải sản',
    'Bún ngan',
    'Hủ tiếu Nam Vang',
    'Hủ tiếu bò',
    'Hủ tiếu sa tế',
    'Hủ tiếu hải sản',
    'Miến gà',
    'Miến vịt',
    'Miến lươn',
    'Mì Quảng',
    'Mì vịt tiềm',
    'Mì cay Hàn Quốc',
    'Mì cay hải sản',
    'Mì ramen cay',
    'Ramen',
    'Udon',
    'Udon bò',
    'Udon tempura',
    'Soba',
    'Soba lạnh',
    'Bánh canh cua',
    'Bánh canh chả cá',
    'Bánh canh ghẹ',
    'Bánh đa cua',
    'Hoành thánh',
    'Hoành thánh nước',
    'Malatang',
    'Laksa',
    'Tomyum',
    'Tomyum hải sản',
    'Shabu shabu',
    'Canh kim chi bò',
    'Lẩu Thái',
    'Lẩu hải sản',
    'Lẩu bò',
    'Lẩu gà lá é',
    'Lẩu cá kèo',
    'Lẩu bò nhúng giấm',
    'Lẩu nướng Hàn Quốc',
    'Lẩu kim chi',
    'Súp cua',
    'Súp hải sản',
    'Súp gà',
    'Canh rong biển Hàn Quốc',
    'Canh kim chi',
    'Canh miso',
    'Oden',
    'Mì udon cay',
    'Ramen tonkotsu',
    'Ramen miso',
    'Mì hoành thánh',
    'Phở trộn',
    'Bún thịt nướng nước',
    'Bún nước lèo',
  ],
};

const branchBaseTags: Record<Branch, string[]> = {
  home_dry: ['home', 'dry', 'vietnam'],
  home_wet: ['home', 'wet', 'vietnam'],
  outside_dry: ['outside', 'dry'],
  outside_wet: ['outside', 'wet'],
};

const internationalSignals = [
  'pizza',
  'burger',
  'hotdog',
  'pasta',
  'mỳ ý',
  'sushi',
  'kimbap',
  'tokbokki',
  'takoyaki',
  'okonomiyaki',
  'kebab',
  'taco',
  'katsu',
  'tonkatsu',
  'dimsum',
  'yakisoba',
  'steak',
  'ramen',
  'udon',
  'soba',
  'malatang',
  'laksa',
  'tomyum',
  'shabu',
  'miso',
  'oden',
  'hàn quốc',
  'nhật',
  'carbonara',
  'tempura',
  'kim chi',
  'curry',
];

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function includesAny(value: string, terms: readonly string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function inferTags(name: string, branch: Branch): string[] {
  const lower = name.toLowerCase();
  const tags = new Set<string>(branchBaseTags[branch]);

  if (branch.startsWith('outside')) {
    tags.add(includesAny(lower, internationalSignals) ? 'international' : 'vietnam');
  }

  if (includesAny(lower, ['cơm', 'xôi', 'niêu'])) tags.add('rice');
  if (includesAny(lower, ['bún', 'mì', 'mỳ', 'miến', 'hủ tiếu', 'phở', 'nui', 'udon', 'soba', 'ramen', 'pasta', 'bánh canh', 'bánh đa', 'hoành thánh', 'yakisoba'])) tags.add('noodle');
  if (includesAny(lower, ['bún', 'miến', 'hủ tiếu', 'mì', 'mỳ', 'soba'])) tags.add('small_noodle');
  if (includesAny(lower, ['phở', 'udon', 'ramen', 'bánh canh', 'nui'])) tags.add('big_noodle');
  if (includesAny(lower, ['thịt', 'ba chỉ', 'sườn', 'bò', 'heo', 'lòng', 'xương', 'nem', 'xíu mại', 'steak', 'burger', 'kebab', 'tonkatsu', 'katsu'])) tags.add('meat');
  if (includesAny(lower, ['gà', 'vịt', 'ngan'])) tags.add('chicken');
  if (includesAny(lower, ['bò', 'steak'])) tags.add('beef');
  if (includesAny(lower, ['cá', 'tôm', 'mực', 'hải sản', 'cua', 'ghẹ', 'nghêu', 'lươn', 'cá hồi'])) tags.add('seafood');
  if (includesAny(lower, ['trứng', 'đậu hũ', 'đậu'])) tags.add('egg_tofu');
  if (includesAny(lower, ['rau', 'cải', 'bí', 'mồng tơi', 'bầu', 'nấm', 'su su', 'đậu que', 'cà tím', 'bắp', 'salad', 'gỏi', 'khổ qua', 'khoai', 'rong biển'])) tags.add('vegetable');
  if (includesAny(lower, ['chiên', 'rán', 'giòn', 'xù', 'khoai tây', 'takoyaki', 'sủi cảo chiên', 'cơm cháy'])) tags.add('fried');
  if (includesAny(lower, ['giòn', 'xù', 'rán', 'chiên', 'cơm cháy'])) tags.add('crispy');
  if (includesAny(lower, ['xào', 'rang', 'lúc lắc', 'áp chảo'])) tags.add('stir_fry');
  if (includesAny(lower, ['kho', 'rim', 'ram', 'om'])) tags.add('braised');
  if (includesAny(lower, ['sốt', 'cà ri', 'nước mắm', 'mắm', 'carbonara', 'miso', 'tonkotsu'])) tags.add('saucy');
  if (includesAny(lower, ['cay', 'sa tế', 'sả ớt', 'kim chi', 'thái', 'tomyum', 'malatang', 'laksa', 'ớt'])) tags.add('spicy');
  if (!tags.has('spicy')) tags.add('mild');
  if (includesAny(lower, ['canh', 'cháo', 'súp', 'phở', 'bún', 'mì', 'miến', 'hủ tiếu', 'lẩu', 'nước', 'ramen', 'udon', 'soba', 'bánh canh', 'hoành thánh', 'malatang', 'laksa', 'tomyum', 'oden'])) tags.add('hot');
  if (includesAny(lower, ['canh', 'cháo', 'súp'])) tags.add('soup');
  if (includesAny(lower, ['cháo'])) tags.add('porridge');
  if (includesAny(lower, ['lẩu', 'shabu'])) {
    tags.add('hotpot');
    tags.add('shared');
    tags.add('chill');
  }
  if (includesAny(lower, ['canh', 'cháo', 'súp', 'gỏi', 'salad', 'cuốn', 'luộc', 'hấp'])) {
    tags.add('light');
    tags.add('low_oil');
  }
  if (includesAny(lower, ['nướng', 'chiên', 'rán', 'xối mỡ', 'bơ', 'phô mai', 'ba chỉ', 'heo quay', 'carbonara'])) {
    tags.add('oily');
    tags.add('rich');
  }
  if (includesAny(lower, ['kho', 'rim', 'sốt', 'lẩu', 'cà ri', 'bò kho', 'bún bò', 'mắm', 'sa tế'])) tags.add('rich');
  if (includesAny(lower, ['cơm', 'xôi', 'bánh mì', 'bò', 'gà', 'lẩu', 'nui', 'phở', 'bún bò', 'ramen', 'udon', 'burger', 'pizza'])) tags.add('filling');
  if (includesAny(lower, ['bánh mì', 'hotdog', 'burger', 'taco', 'kebab', 'cuốn', 'xiên', 'cá viên', 'bò viên'])) tags.add('portable');
  if (includesAny(lower, ['bánh tráng', 'khoai', 'xiên', 'cá viên', 'bò viên', 'takoyaki', 'há cảo', 'dimsum'])) tags.add('snackable');
  if (includesAny(lower, ['canh chua', 'chua', 'tomyum', 'bún thái'])) tags.add('sour');
  if (includesAny(lower, ['trong', 'canh', 'phở', 'hủ tiếu', 'miến'])) tags.add('clear_broth');
  if (includesAny(lower, ['béo', 'phô mai', 'carbonara', 'tonkotsu', 'cà ri', 'bơ'])) tags.add('creamy');
  if (includesAny(lower, ['cơm văn phòng', 'bánh mì', 'xôi', 'mì trứng', 'trứng chiên', 'đậu hũ', 'canh'])) tags.add('budget');
  if (includesAny(lower, ['steak', 'cá hồi', 'hải sản', 'lẩu', 'sushi', 'sườn', 'bò lúc lắc'])) tags.add('premium');
  if (includesAny(lower, ['hấp', 'luộc', 'áp chảo', 'salad', 'gỏi cuốn'])) tags.add('balanced');
  if (includesAny(lower, ['thịt', 'ba chỉ', 'sườn', 'gà', 'bò', 'heo', 'steak', 'burger'])) tags.add('meaty');

  if (!tags.has('saucy')) tags.add('dry_finish');
  if (!tags.has('filling')) tags.add(tags.has('light') ? 'light_bite' : 'balanced');
  if (tags.has('fried') || tags.has('stir_fry') || tags.has('egg_tofu') || tags.has('portable')) tags.add('quick');
  if (tags.has('braised') || tags.has('hotpot') || name.toLowerCase().includes('hầm')) tags.add('slow');

  return uniqueStrings(Array.from(tags));
}

function getEmoji(name: string, tags: readonly string[], branch: Branch): string {
  const lower = name.toLowerCase();

  if (includesAny(lower, ['bánh mì', 'hotdog'])) return '🥖';
  if (includesAny(lower, ['pizza'])) return '🍕';
  if (includesAny(lower, ['burger'])) return '🍔';
  if (includesAny(lower, ['sushi', 'kimbap', 'cơm cuộn'])) return '🍣';
  if (includesAny(lower, ['salad', 'gỏi cuốn', 'gỏi'])) return '🥗';
  if (includesAny(lower, ['steak', 'bò né', 'bò lúc lắc', 'bò áp chảo'])) return '🥩';
  if (includesAny(lower, ['gà rán', 'gà chiên giòn', 'cánh gà', 'gà chiên'])) return '🍗';
  if (includesAny(lower, ['trứng'])) return '🍳';
  if (includesAny(lower, ['đậu hũ', 'rau', 'cải', 'nấm', 'su su', 'bắp', 'cà tím', 'khổ qua'])) return '🥬';
  if (includesAny(lower, ['canh', 'súp', 'lẩu', 'shabu', 'oden'])) return '🍲';
  if (includesAny(lower, ['phở', 'bún', 'mì', 'mỳ', 'miến', 'hủ tiếu', 'ramen', 'udon', 'soba', 'nui', 'bánh canh', 'bánh đa', 'hoành thánh', 'malatang', 'laksa', 'tomyum'])) return '🍜';

  if (tags.includes('hotpot')) return '🍲';
  if (tags.includes('rice')) return '🍚';
  if (tags.includes('noodle')) return '🍜';
  if (tags.includes('seafood')) return '🦐';
  if (tags.includes('chicken')) return '🍗';
  if (tags.includes('beef') || tags.includes('meat')) return '🥩';
  if (tags.includes('egg_tofu')) return '🍳';
  if (tags.includes('vegetable')) return '🥬';
  if (tags.includes('fried')) return '🍤';
  return branch.endsWith('wet') ? '🥣' : '🍽️';
}

function getEstimatedPrice(tags: readonly string[], branch: Branch): string {
  if (branch.startsWith('home')) {
    if (tags.includes('hotpot')) return '120.000đ - 260.000đ';
    if (tags.includes('premium') || tags.includes('seafood')) return '55.000đ - 140.000đ';
    return '25.000đ - 80.000đ';
  }

  if (tags.includes('budget')) return '25.000đ - 50.000đ';
  if (tags.includes('premium') || tags.includes('hotpot')) return '80.000đ - 220.000đ';
  return branch.endsWith('wet') ? '40.000đ - 85.000đ' : '35.000đ - 95.000đ';
}

function getPrepTime(tags: readonly string[], branch: Branch): string {
  if (branch.startsWith('outside')) {
    return tags.includes('hotpot') || tags.includes('chill') ? '20 - 45 phút' : '10 - 20 phút';
  }

  if (tags.includes('hotpot')) return '35 - 70 phút';
  if (tags.includes('slow')) return '30 - 60 phút';
  if (tags.includes('quick')) return '10 - 25 phút';
  return '20 - 40 phút';
}

function getFullness(tags: readonly string[]): string {
  if (tags.includes('hotpot') || tags.includes('rice') || tags.includes('filling')) return 'No lâu';
  if (tags.includes('light') || tags.includes('light_bite')) return 'Nhẹ bụng';
  return 'Vừa bụng';
}

function getDescription(name: string, tags: readonly string[], branch: Branch): string {
  const place = branch.startsWith('home') ? 'tự làm tại nhà' : 'gọi khi ăn ngoài';
  const body = tags.includes('wet') ? 'ấm bụng' : tags.includes('crispy') ? 'giòn vui miệng' : 'gọn và dễ ăn';
  const flavor = tags.includes('spicy') ? 'có chút cay' : tags.includes('rich') ? 'đậm vị' : 'dễ chịu';
  return `${name} ${body}, ${flavor}, hợp để ${place}.`;
}

function createFood(name: string, branch: Branch): Food {
  const tags = inferTags(name, branch);

  return {
    id: `${branch}_${slugify(name)}`,
    name,
    branch,
    description: getDescription(name, tags, branch),
    estimatedPrice: getEstimatedPrice(tags, branch),
    prepTime: getPrepTime(tags, branch),
    fullness: getFullness(tags),
    emoji: getEmoji(name, tags, branch),
    tags,
  };
}

export const foods: Food[] = Object.entries(foodNamesByBranch).flatMap(([branch, names]) =>
  names.map((name) => createFood(name, branch as Branch)),
);

export const foodCountsByBranch: Record<Branch, number> = {
  home_dry: foodNamesByBranch.home_dry.length,
  home_wet: foodNamesByBranch.home_wet.length,
  outside_dry: foodNamesByBranch.outside_dry.length,
  outside_wet: foodNamesByBranch.outside_wet.length,
};
