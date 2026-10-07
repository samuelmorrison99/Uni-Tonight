export interface Venue {
  id: string;
  name: string;
  area: string;
  image: string;
  type: string;
  rating: number;
  closingTime: string;
  latlng: [number, number];
}

export const LIVERPOOL_VENUES: any[] = [
  // Concert Square & Fleet Street
  { id: 'lv-01', name: 'Heebie Jeebies', area: 'Seel Street', type: 'Bar / Club', rating: 4.6, closingTime: '04:00 AM', latlng: [53.4022, -2.9782], image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-02', name: 'McCooley\'s', area: 'Concert Square', type: 'Irish Pub', rating: 4.4, closingTime: '03:00 AM', latlng: [53.4025, -2.9788], image: 'https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-03', name: 'Level Nightclub', area: 'Concert Square', type: 'Night Club', rating: 4.2, closingTime: '04:00 AM', latlng: [53.4026, -2.9785], image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-04', name: 'Modo', area: 'Concert Square', type: 'Cocktail Bar', rating: 4.3, closingTime: '03:00 AM', latlng: [53.4024, -2.9787], image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-05', name: 'Einstein Bier Haus', area: 'Concert Square', type: 'Bavarian Bar', rating: 4.5, closingTime: '02:00 AM', latlng: [53.4028, -2.9789], image: 'https://images.unsplash.com/photo-1614316664972-7634f19b8f2d?w=500&auto=format&fit=crop&q=60' },
  
  // Seel Street & Slater Street
  { id: 'lv-06', name: 'The Raz (Blue Angel)', area: 'Seel Street', type: 'Student Club', rating: 4.7, closingTime: '04:00 AM', latlng: [53.4005, -2.9754], image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-07', name: 'Alma de Cuba', area: 'Seel Street', type: 'Restaurant & Bar', rating: 4.5, closingTime: '02:00 AM', latlng: [53.4018, -2.9775], image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-08', name: 'Salt Dog Slims', area: 'Seel Street', type: 'Dive Bar', rating: 4.6, closingTime: '02:00 AM', latlng: [53.4019, -2.9772], image: 'https://images.unsplash.com/photo-1520209268518-caa476fa6c76?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-09', name: 'The Merchant', area: 'Slater Street', type: 'Bar & Pizza', rating: 4.4, closingTime: '02:00 AM', latlng: [53.4021, -2.9793], image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-10', name: 'The Shipping Forecast', area: 'Slater Street', type: 'Pub / Live Music', rating: 4.3, closingTime: '01:00 AM', latlng: [53.4019, -2.9795], image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=500&auto=format&fit=crop&q=60' },

  // Ropewalks & Duke Street
  { id: 'lv-11', name: 'The Jacaranda', area: 'Slater Street', type: 'Live Music Bar', rating: 4.6, closingTime: '03:00 AM', latlng: [53.4025, -2.9798], image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-12', name: 'Roxy Ball Room', area: 'Hanover Street', type: 'Activity Bar', rating: 4.5, closingTime: '02:00 AM', latlng: [53.4029, -2.9813], image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-13', name: 'Pins Social Club', area: 'Duke Street', type: 'Activity Bar', rating: 4.7, closingTime: '02:00 AM', latlng: [53.4012, -2.9792], image: 'https://images.unsplash.com/photo-1582236173003-7f2eeb4934e6?w=500&auto=format&fit=crop&q=60' },

  // Baltic Triangle
  { id: 'lv-14', name: 'Camp and Furnace', area: 'Baltic Triangle', type: 'Warehouse Venue', rating: 4.5, closingTime: '12:00 AM', latlng: [53.3934, -2.9782], image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-15', name: 'Baltic Market', area: 'Baltic Triangle', type: 'Food Hall / Bar', rating: 4.7, closingTime: '11:00 PM', latlng: [53.3929, -2.9788], image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-16', name: 'Peaky Blinders Bar', area: 'Baltic Triangle', type: 'Themed Bar', rating: 4.3, closingTime: '01:00 AM', latlng: [53.3938, -2.9794], image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-17', name: 'Content', area: 'Baltic Triangle', type: 'Bar / Events', rating: 4.4, closingTime: '12:00 AM', latlng: [53.3942, -2.9805], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-18', name: 'Punch Tarmey\'s', area: 'Baltic Triangle', type: 'Irish Pub', rating: 4.5, closingTime: '02:00 AM', latlng: [53.3931, -2.9798], image: 'https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=500&auto=format&fit=crop&q=60' },

  // Hardman Street / Hope Street (Traditional / Student)
  { id: 'lv-19', name: 'The Philharmonic Dining Rooms', area: 'Hope Street', type: 'Historic Pub', rating: 4.6, closingTime: '12:00 AM', latlng: [53.4007, -2.9698], image: 'https://images.unsplash.com/photo-1588675646184-f5b0b0b0b2ee?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-20', name: 'Ye Cracke', area: 'Rice Street', type: 'Traditional Pub', rating: 4.5, closingTime: '11:00 PM', latlng: [53.4002, -2.9701], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-21', name: 'The Pilgrim', area: 'Pilgrim Street', type: 'Student Pub', rating: 4.4, closingTime: '12:00 AM', latlng: [53.4004, -2.9715], image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-22', name: 'Buyers Club', area: 'Hardman Street', type: 'Bar & Garden', rating: 4.6, closingTime: '12:00 AM', latlng: [53.4005, -2.9723], image: 'https://images.unsplash.com/photo-1517480287413-585eeefc2491?w=500&auto=format&fit=crop&q=60' },

  // Smithdown Road (Deep Student Area)
  { id: 'lv-23', name: 'The Brookhouse', area: 'Smithdown Road', type: 'Student Pub', rating: 4.3, closingTime: '12:00 AM', latlng: [53.3885, -2.9298], image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-24', name: 'Kelly\'s Dispensary', area: 'Smithdown Road', type: 'Pub', rating: 4.7, closingTime: '12:00 AM', latlng: [53.3901, -2.9344], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-25', name: 'Craft Taproom', area: 'Smithdown Road', type: 'Craft Beer Bar', rating: 4.6, closingTime: '11:00 PM', latlng: [53.3892, -2.9321], image: 'https://images.unsplash.com/photo-1582226224225-78e727dbf89d?w=500&auto=format&fit=crop&q=60' },

  // Mathew Street / Cavern Quarter
  { id: 'lv-26', name: 'The Cavern Club', area: 'Mathew Street', type: 'Live Music / Club', rating: 4.7, closingTime: '02:00 AM', latlng: [53.4063, -2.9877], image: 'https://images.unsplash.com/photo-1528644498305-b827e8d64115?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-27', name: 'Flanagan\'s Apple', area: 'Mathew Street', type: 'Irish Pub', rating: 4.3, closingTime: '01:00 AM', latlng: [53.4061, -2.9871], image: 'https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-28', name: 'O\'Neill\'s', area: 'Hanover Street', type: 'Irish Pub', rating: 4.2, closingTime: '02:00 AM', latlng: [53.4035, -2.9825], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60' },
  
  // High-End City Centre & Docks
  { id: 'lv-29', name: 'The Alchemist', area: 'Brunswick Street', type: 'Cocktail Bar', rating: 4.5, closingTime: '01:00 AM', latlng: [53.4053, -2.9912], image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-30', name: 'The Botanist', area: 'Liverpool ONE', type: 'Bar & Restaurant', rating: 4.6, closingTime: '12:00 AM', latlng: [53.4026, -2.9856], image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-31', name: 'Bierkeller', area: 'Liverpool ONE', type: 'Bavarian Bar', rating: 4.2, closingTime: '01:00 AM', latlng: [53.4027, -2.9870], image: 'https://images.unsplash.com/photo-1614316664972-7634f19b8f2d?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-32', name: 'Revolution', area: 'Albert Dock', type: 'Cocktail Bar / Club', rating: 4.1, closingTime: '02:00 AM', latlng: [53.4005, -2.9910], image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-33', name: 'The One O\'Clock Gun', area: 'Albert Dock', type: 'Pub', rating: 4.5, closingTime: '12:00 AM', latlng: [53.4010, -2.9920], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60' },

  // Ropewalks / Concert Square / Seel Street (Expansions)
  { id: 'lv-34', name: 'Baa Bar', area: 'Fleet Street', type: 'Bar / Club', rating: 4.1, closingTime: '03:00 AM', latlng: [53.4024, -2.9782], image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-35', name: 'Electrik Warehouse', area: 'Wood Street', type: 'Rock / Indie Club', rating: 4.4, closingTime: '04:00 AM', latlng: [53.4020, -2.9778], image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-36', name: 'Black Rabbit Shot Co.', area: 'Fleet Street', type: 'Shot Bar', rating: 4.2, closingTime: '04:00 AM', latlng: [53.4025, -2.9780], image: 'https://images.unsplash.com/photo-1520209268518-caa476fa6c76?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-37', name: 'Soho', area: 'Concert Square', type: 'Lounge Bar', rating: 4.0, closingTime: '03:00 AM', latlng: [53.4025, -2.9786], image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-38', name: 'Boston Pool Loft', area: 'Concert Square', type: 'Sports Bar', rating: 4.3, closingTime: '02:00 AM', latlng: [53.4025, -2.9785], image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-39', name: 'Pogue Mahone', area: 'Seel Street', type: 'Irish Pub', rating: 4.6, closingTime: '01:00 AM', latlng: [53.4021, -2.9760], image: 'https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-40', name: 'Kazimier Garden', area: 'Seel Street', type: 'Outdoor Bar', rating: 4.7, closingTime: '12:00 AM', latlng: [53.4020, -2.9790], image: 'https://images.unsplash.com/photo-1517480287413-585eeefc2491?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-41', name: 'Popworld', area: 'Wood Street', type: 'Party Club', rating: 3.9, closingTime: '04:00 AM', latlng: [53.4030, -2.9805], image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-42', name: 'Be At One', area: 'Seel Street', type: 'Cocktail Bar', rating: 4.4, closingTime: '02:00 AM', latlng: [53.4025, -2.9772], image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-43', name: 'Phase One', area: 'Seel Street', type: 'Live Music / Bar', rating: 4.5, closingTime: '02:00 AM', latlng: [53.4018, -2.9765], image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-44', name: 'Teddy\'s', area: 'Slater Street', type: 'Dive Bar / Rock', rating: 4.6, closingTime: '04:00 AM', latlng: [53.4022, -2.9790], image: 'https://images.unsplash.com/photo-1520209268518-caa476fa6c76?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-45', name: 'The Swan Inn', area: 'Wood Street', type: 'Rock & Metal Pub', rating: 4.7, closingTime: '12:00 AM', latlng: [53.4032, -2.9795], image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=500&auto=format&fit=crop&q=60' },
  
  // Mathew Street (Expansions)
  { id: 'lv-46', name: 'Flares', area: 'Mathew Street', type: 'Party Club', rating: 4.0, closingTime: '03:00 AM', latlng: [53.4063, -2.9875], image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-47', name: 'Cavern Pub', area: 'Mathew Street', type: 'Live Music Pub', rating: 4.5, closingTime: '12:00 AM', latlng: [53.4062, -2.9878], image: 'https://images.unsplash.com/photo-1528644498305-b827e8d64115?w=500&auto=format&fit=crop&q=60' },

  // Deep Student & Campus Pubs
  { id: 'lv-48', name: 'The Hope & Anchor', area: 'Maryland Street', type: 'Student Pub', rating: 4.3, closingTime: '12:00 AM', latlng: [53.4020, -2.9690], image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-49', name: 'The Cambridge', area: 'Cambridge Street', type: 'Student Pub', rating: 4.4, closingTime: '11:00 PM', latlng: [53.4010, -2.9650], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-50', name: 'The Augustus John', area: 'UoL Campus', type: 'Campus Pub', rating: 4.5, closingTime: '11:00 PM', latlng: [53.4045, -2.9665], image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-51', name: 'The Sphinx', area: 'Liverpool Guild', type: 'Student Union Bar', rating: 4.2, closingTime: '11:00 PM', latlng: [53.4055, -2.9645], image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-52', name: 'The Font', area: 'Arrad Street', type: 'Student Bar / Gaming', rating: 4.5, closingTime: '12:00 AM', latlng: [53.4040, -2.9675], image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500&auto=format&fit=crop&q=60' },

  // Baltic Triangle (Expansions)
  { id: 'lv-53', name: '24 Kitchen Street', area: 'Baltic Triangle', type: 'Underground Club', rating: 4.6, closingTime: '04:00 AM', latlng: [53.3955, -2.9805], image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-54', name: 'Hangar 34', area: 'Baltic Triangle', type: 'Club & Live Music', rating: 4.4, closingTime: '04:00 AM', latlng: [53.3945, -2.9780], image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60' },

  // Georgian Quarter & Surrounding
  { id: 'lv-55', name: 'The Grapes', area: 'Roscoe Street', type: 'Pub & Jazz', rating: 4.7, closingTime: '12:00 AM', latlng: [53.4008, -2.9725], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-56', name: 'The Dispensary', area: 'Renshaw Street', type: 'Traditional Pub', rating: 4.6, closingTime: '11:00 PM', latlng: [53.4025, -2.9740], image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=500&auto=format&fit=crop&q=60' },

  // Penny Lane / South Liverpool
  { id: 'lv-57', name: 'The Dovedale Towers', area: 'Penny Lane', type: 'Pub', rating: 4.5, closingTime: '11:00 PM', latlng: [53.3855, -2.9235], image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=500&auto=format&fit=crop&q=60' },
  { id: 'lv-58', name: 'The Penny Lane', area: 'Penny Lane', type: 'Traditional Pub', rating: 4.4, closingTime: '11:00 PM', latlng: [53.3850, -2.9250], image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60' }
];
