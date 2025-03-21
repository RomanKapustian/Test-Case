import { h } from 'preact';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'utils/image';

const ProductGallery = (props) => (
  <Swiper>
    {props.product?.images.map((img) => (
      <SwiperSlide key={img.id}>
        <Image
          {...img}
          srcWidths={{ sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }}
        />
      </SwiperSlide>
    ))}
  </Swiper>
);

export default ProductGallery;
