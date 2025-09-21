import { useState } from "react";

import Section from "../Section/Section";
import Container from "../Container/Container";
import { Toaster } from "react-hot-toast";
import Form from "../Form/Form";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";

import { getPhotos } from "../../services/photos";
import type { Photo } from "../../types/photo";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Modal from "../Modal/Modal";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleSearch = async (topic: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getPhotos(topic);
      setPhotos(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };
  const handlePhotoClose = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <Section>
        <Container>
          <Toaster position="top-center" reverseOrder={false} />
          <Form onSubmit={handleSearch} />
          {isLoading && <Loader />}
          {isError && (
            <Text>
              <strong>Oops, something went wrong...</strong>
            </Text>
          )}
          {photos && (
            <PhotosGallery photos={photos} onSelect={handlePhotoClick} />
          )}
          {selectedPhoto && (
            <Modal onClose={handlePhotoClose}>
              <img src={selectedPhoto.src.large} alt={selectedPhoto.alt} />
            </Modal>
          )}
        </Container>
      </Section>
    </>
  );
}
